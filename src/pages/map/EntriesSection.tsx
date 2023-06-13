import {GetMapQuery, MapEntryFormat} from "../../graphql/graphql";
import {useSearchParamsState} from "../../utils/searchParamHook";
import {useMutation, useQuery} from "@apollo/client";
import {FileCodeIcon, NumberIcon, TypographyIcon} from "@primer/octicons-react";
import {ActionList, ActionMenu, Pagination} from "@primer/react";
import React, {useState} from "react";
import {gql} from "../../graphql";
import {useAppDispatch} from "../../store/root";
import {flashActions} from "../../store/flashes";


const GQL_MAP_QUERY_ENTRIES = gql(/* GraphQL */ `
  query GetMapEntries($mapId: Int!, $offset: Int!, $limit: Int!, $keyFormat: MapEntryFormat!, $valueFormat: MapEntryFormat!) {
    map(id: $mapId) {
      isPerCPU
      entries(offset: $offset, limit: $limit, keyFormat: $keyFormat, valueFormat: $valueFormat) {
        key
        value
        cpuValues
      }
      entriesCount
    }
}
`);

const GQL_UPDATE_MAP_VALUE = gql(/* GraphQL */ `
  mutation UpdateMapValue(
      $mapId: Int!, $key: String!, $cpu: Int, $value: String!,
      $keyFormat: MapEntryFormat!, $valueFormat: MapEntryFormat!
  ) {
    updateMapValue(mapId: $mapId, key: $key, cpu: $cpu, value: $value, keyFormat: $keyFormat, valueFormat: $valueFormat) {
      error
    }
  }
`);

interface editableCellProps {
  format?: MapEntryFormat;
  isEditing?: boolean;
  value: string;
  onMove?: (direction: 'up'|'down') => void;
  onActivate?: () => void;
  onSubmit?: (value: string) => void;
  onCancel?: () => void;
}

function EditableCell({value, format, isEditing, onMove, onActivate, onSubmit, onCancel}: editableCellProps) {
  const [editingValue, setEditingValue] = useState(value);

  function doOnCancel(elem: HTMLSpanElement) {
    elem.innerText = value;
    setEditingValue(value);
    onCancel && onCancel()
  }

  return <td><span
    onBlur={e => doOnCancel(e.target)}
    contentEditable={isEditing}
    onClick={e => {
      if (isEditing) return;
      setEditingValue(value);
      onActivate && onActivate()
      if (format === MapEntryFormat.Number) {
        const range = document.createRange();
        // @ts-ignore
        range.selectNodeContents(e.target);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      setTimeout(() => {
        // @ts-ignore
        e.target.focus();
      }, 10);
    }}
    onKeyDown={e => {
      if (e.key === 'Enter') {
        onSubmit && onSubmit(editingValue);
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }}
    onKeyUp={e => {
      if (e.key === 'Escape') {
        // @ts-ignore
        doOnCancel(e.target);
      } else if (e.key === 'ArrowUp') {
        onMove && onMove('up');
      } else if (e.key === 'ArrowDown') {
        onMove && onMove('down');
      }
    }}
    onInput={(e) => {
      // @ts-ignore
      setEditingValue(e.target.innerText)
    }}
  >{value}</span></td>;
}

export function EntriesSection({map: {
  id, type, valueSize,
  isPerCPU, isLookupSupported
}}: { map: GetMapQuery["map"] }) {

  const dispatchApp = useAppDispatch();

  const defaultValueFormat = (valueSize || 0) <= 8 ? MapEntryFormat.Number : MapEntryFormat.Hex;

  const [keyFormat, setKeyFormat] = useSearchParamsState('fkey', MapEntryFormat.Hex, strValue => strValue as MapEntryFormat);
  const [valueFormat, setValueFormat] = useSearchParamsState('fvalue', defaultValueFormat, strValue => strValue as MapEntryFormat);

  const [page, setPage] = useSearchParamsState('page', 1, strValue => parseInt(strValue));

  const pageSize = 25;

  const {loading, error, data} = useQuery(GQL_MAP_QUERY_ENTRIES, {
    variables: {
      mapId: id,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      keyFormat: keyFormat,
      valueFormat: valueFormat,
    },
  });

  const mapEntries = data?.map.entries || [];
  const mapEntriesCount = data?.map.entriesCount || 0;

  const pageCount = Math.max(1, Math.ceil(mapEntriesCount / pageSize));

  const cpus = !isPerCPU ? 1 : Math.max(mapEntries[0]?.cpuValues?.length || 1, 1);

  const formatIcons = {
    [MapEntryFormat.Hex]: FileCodeIcon,
    [MapEntryFormat.Number]: NumberIcon,
    [MapEntryFormat.String]: TypographyIcon,
  }

  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [updateValue, valueUpdateStatus] = useMutation(GQL_UPDATE_MAP_VALUE, {
    refetchQueries: [GQL_MAP_QUERY_ENTRIES],
    errorPolicy: 'ignore',
    onCompleted: (data) => {
      if (data.updateMapValue?.error) {
        dispatchApp(flashActions.push({id: Math.random(), message: data.updateMapValue.error, variant: 'danger'}));
      } else {
        setEditingCell(null);
      }
    },
    onError: (error) => {
      dispatchApp(flashActions.push({id: Math.random(), message: error.message, variant: 'danger'}));
    }
  });

  return !isLookupSupported
    ? <>Lookup is not implemented for map type <b>{type}</b></>
    :
    <div>
      {
        loading ? <p>Loading...</p> :
          error ? <p>Error: {error.message}</p> :
            <>
              Total entries: {mapEntriesCount}
              {valueUpdateStatus.loading && <span>Updating...</span>}
              <div className={'map-entries-wrapper'}>
                <table className={'map-entries'}>
                  <thead>
                  <tr>
                    <td rowSpan={cpus > 1 ? 2 : 1}>
                      <ActionMenu>
                        <ActionMenu.Button aria-label="Select key format" leadingIcon={formatIcons[keyFormat]}>KEY</ActionMenu.Button>
                        <ActionMenu.Overlay>
                          <ActionList>
                            {[MapEntryFormat.Hex, MapEntryFormat.Number, MapEntryFormat.String].map((format) =>
                              <ActionList.Item key={format} onClick={() => setKeyFormat(format)}>
                                <ActionList.LeadingVisual>
                                  {React.createElement(formatIcons[format])}
                                </ActionList.LeadingVisual>
                                {format.toLowerCase()}
                              </ActionList.Item>
                            )}
                          </ActionList>
                        </ActionMenu.Overlay>
                      </ActionMenu>
                    </td>
                    <td colSpan={cpus}>
                      <ActionMenu>
                        <ActionMenu.Button aria-label="Select value format" leadingIcon={formatIcons[valueFormat]}>VALUE</ActionMenu.Button>
                        <ActionMenu.Overlay>
                          <ActionList>
                            {[MapEntryFormat.Hex, MapEntryFormat.Number, MapEntryFormat.String].map((format) =>
                              <ActionList.Item key={format} onClick={() => setValueFormat(format)}>
                                <ActionList.LeadingVisual>
                                  {React.createElement(formatIcons[format])}
                                </ActionList.LeadingVisual>
                                {format.toLowerCase()}
                              </ActionList.Item>
                            )}
                          </ActionList>
                        </ActionMenu.Overlay>
                      </ActionMenu>
                    </td>
                  </tr>
                  {cpus <= 1 ? null :
                    <tr className={'cpu-heads'}>
                      {Array(cpus).fill(0).map((_, i) => <td key={i}>{i}</td>)}
                    </tr>
                  }
                  </thead>
                  <tbody className={valueFormat === MapEntryFormat.Number ? 'number-values' : ''}>
                  {mapEntries.map((e, i) => (
                    <tr key={i}>
                      <td>{e.key}</td>
                      {cpus <= 1 ?
                        <EditableCell value={e.value || ''}
                                      format={valueFormat}
                                      isEditing={editingCell === `${e.key}`}
                                      onActivate={() => setEditingCell(`${e.key}`)}
                                      onCancel={() => setEditingCell(null)}
                                      onSubmit={value => {
                                        updateValue({
                                          variables: {
                                            mapId: id,
                                            key: e.key,
                                            value: value,
                                            keyFormat: keyFormat,
                                            valueFormat: valueFormat,
                                          },
                                        })
                                      }}
                        />
                        : Array(cpus).fill(0).map((_, i) => (
                          <EditableCell key={i}
                                        format={valueFormat}
                                        value={e.cpuValues[i] || ''}
                                        isEditing={editingCell === `${e.key}-${i}`}
                                        onActivate={() => setEditingCell(`${e.key}-${i}`)}
                                        onCancel={() => setEditingCell(null)}
                                        onSubmit={value => updateValue({
                                          variables: {
                                            mapId: id,
                                            key: e.key,
                                            value: value,
                                            keyFormat: keyFormat,
                                            valueFormat: valueFormat,
                                            cpu: i,
                                          },
                                        })}
                          />))
                      }
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
              <Pagination pageCount={pageCount} currentPage={page}
                          onPageChange={(e, pageNum) => {
                            setPage(pageNum.toString());
                            e.preventDefault()
                          }} />
            </>
      }
    </div>
}
