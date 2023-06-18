import {GetMapQuery, MapEntryFormat} from "../../graphql/graphql";
import {useSearchParamsState} from "../../utils/searchParamHook";
import {useMutation, useQuery} from "@apollo/client";
import {
  FileCodeIcon,
  KebabHorizontalIcon,
  NumberIcon,
  PlusIcon,
  TrashIcon,
  TypographyIcon,
} from "@primer/octicons-react";
import {ActionList, ActionMenu, IconButton, Pagination} from "@primer/react";
import React, {useCallback, useMemo, useState} from "react";
import {gql} from "../../graphql";
import {useAppDispatch} from "../../store/root";
import {flashActions} from "../../store/flashes";
import {EditableCell} from "./EditableCell";
import {useSet} from "../../utils/useSet";


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

const GQL_CREATE_MAP_VALUE = gql(/* GraphQL */ `
  mutation CreateMapValue(
    $mapId: Int!, $key: String!, $values: [String!]!,
    $keyFormat: MapEntryFormat!, $valueFormat: MapEntryFormat!
  ) {
    createMapValue(mapId: $mapId, key: $key, values: $values, keyFormat: $keyFormat, valueFormat: $valueFormat) {
      error
    }
  }
`);

const GQL_DELETE_MAP_VALUES = gql(/* GraphQL */ `
  mutation DeleteMapValues(
    $mapId: Int!, $keys: [String!]!, $keyFormat: MapEntryFormat!
  ) {
    deleteMapValues(mapId: $mapId, keys: $keys, keyFormat: $keyFormat) {
      error
    }
  }
`);

export function EntriesSection({
                                 map: {
                                   id, type, valueSize,
                                   isPerCPU, isLookupSupported
                                 }
                               }: { map: GetMapQuery["map"] }) {

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

  const defaultItemValues = useMemo(() => cpus > 1 ? new Array(cpus).fill('') : [''], [cpus]);

  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [updateValue, valueUpdateStatus] = useMutation(GQL_UPDATE_MAP_VALUE, {
    refetchQueries: [GQL_MAP_QUERY_ENTRIES],
    errorPolicy: 'ignore',
    onCompleted: (data) => {
      if (data.updateMapValue?.error) {
        dispatchApp(flashActions.push({message: data.updateMapValue.error, variant: 'danger'}));
      } else {
        setEditingCell(null);
      }
    },
    onError: (error) => {
      dispatchApp(flashActions.push({message: error.message, variant: 'danger'}));
    }
  });
  const [createValue, valueCreateStatus] = useMutation(GQL_CREATE_MAP_VALUE, {
    refetchQueries: [GQL_MAP_QUERY_ENTRIES],
    errorPolicy: 'ignore',
    onCompleted: (data) => {
      if (data.createMapValue?.error) {
        dispatchApp(flashActions.push({message: data.createMapValue.error, variant: 'danger'}));
      } else {
        setEditingNewItem(false);
        setNewItemKey('');
        setNewItemValues(defaultItemValues);
      }
    },
    onError: (error) => {
      dispatchApp(flashActions.push({message: error.message, variant: 'danger'}));
    }
  });


  const [getSelected, isSelected, toggleSelected, clearSelected] = useSet([] as string[]);

  const [deleteValues, valueDeleteStatus] = useMutation(GQL_DELETE_MAP_VALUES, {
    refetchQueries: [GQL_MAP_QUERY_ENTRIES],
    errorPolicy: 'ignore',
    onCompleted: (data) => {
      if (data.deleteMapValues?.error) {
        dispatchApp(flashActions.push({message: data.deleteMapValues.error, variant: 'danger'}));
      } else {
        clearSelected();
      }
    },
    onError: (error) => {
      dispatchApp(flashActions.push({message: error.message, variant: 'danger'}));
    }
  });

  const [newItemKey, setNewItemKey] = useState<string>('');
  const [newItemValues, setNewItemValues] = useState<string[]>(defaultItemValues);
  const [editingNewItem, setEditingNewItem] = useState<boolean>(false);

  const submitNewItem = useCallback((key?: string, values?: string[]) => {
    if (key !== undefined) {
      setNewItemKey(key);
    }
    if (values !== undefined) {
      setNewItemValues(values);
    }
    createValue({
      variables: {
        mapId: id,
        key: key !== undefined ? key : newItemKey,
        values: values !== undefined ? values : newItemValues,
        keyFormat: keyFormat,
        valueFormat: valueFormat,
      }
    })
  }, [createValue, newItemKey, newItemValues, keyFormat, valueFormat]);

  const deleteSelectedItems = useCallback(() => {
    deleteValues({
      variables: {
        mapId: id,
        keys: getSelected(),
        keyFormat: keyFormat,
      }
    });
  }, [getSelected, keyFormat]);

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
              {valueCreateStatus.loading && <span>Creating...</span>}
              <div className={'map-entries-wrapper'}>
                <table className={'map-entries'}>
                  <thead>
                  <tr>
                    <td rowSpan={cpus > 1 ? 2 : 1}>
                      <ActionMenu>
                        <ActionMenu.Anchor>
                          <IconButton icon={KebabHorizontalIcon} variant="invisible" aria-label="Open column options" />
                        </ActionMenu.Anchor>
                        <ActionMenu.Overlay>
                          <ActionList>
                            <ActionList.Item onClick={() => deleteSelectedItems()}>
                              <ActionList.LeadingVisual><TrashIcon /></ActionList.LeadingVisual>
                              Delete selected
                            </ActionList.Item>
                          </ActionList>
                        </ActionMenu.Overlay>
                      </ActionMenu>
                    </td>
                    <td rowSpan={cpus > 1 ? 2 : 1}>
                      <ActionMenu>
                        <ActionMenu.Button aria-label="Select key format"
                                           leadingIcon={formatIcons[keyFormat]}>KEY</ActionMenu.Button>
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
                      <IconButton aria-label={"Add new row"} icon={PlusIcon}
                                  onClick={() => {
                                    setEditingNewItem(true);
                                    setNewItemKey('');
                                  }}/>
                    </td>
                    <td colSpan={cpus}>
                      <ActionMenu>
                        <ActionMenu.Button aria-label="Select value format"
                                           leadingIcon={formatIcons[valueFormat]}>VALUE</ActionMenu.Button>
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
                  {editingNewItem &&
                      <tr className='new'>
                          <td></td>
                          <EditableCell value={newItemKey}
                                        format={keyFormat}
                                        isEditing={editingCell === 'new-key'}
                                        onActivate={() => setEditingCell('new-key')}
                                        onCancel={() => setEditingCell(null)}
                                        onSubmit={(value) => {
                                          submitNewItem(value);
                                        }}
                                        onBlur={(value) => {
                                          setNewItemKey(value);
                                          setEditingCell(null);
                                          return 'keep';
                                        }}
                          />
                        {cpus <= 1 ?
                          <EditableCell value={newItemValues[0]}
                                        format={valueFormat}
                                        isEditing={editingCell === 'new-value'}
                                        onActivate={() => setEditingCell('new-value')}
                                        onCancel={() => setEditingCell(null)}
                                        onBlur={(value) => {
                                          setNewItemValues([value]);
                                          setEditingCell(null);
                                          return 'keep';
                                        }}
                                        onSubmit={(value) => {
                                          submitNewItem(undefined, [value]);
                                        }}
                          />
                          : Array(cpus).fill(0).map((_, i) => (
                            <EditableCell key={i}
                                          format={valueFormat}
                                          value={newItemValues[i]}
                                          isEditing={editingCell === `new-value-${i}`}
                                          onActivate={() => setEditingCell(`new-value-${i}`)}
                                          onCancel={() => setEditingCell(null)}
                                          onBlur={(value) => {
                                            setNewItemValues(values => {
                                              values[i] = value;
                                              return [...values];
                                            });
                                            setEditingCell(null);
                                            return 'keep';
                                          }}
                                          onSubmit={(value) => {
                                            const values = [...newItemValues];
                                            values[i] = value;
                                            submitNewItem(undefined, values);
                                          }}
                            />
                          ))
                        }
                      </tr>
                  }
                  {mapEntries.map((e, i) => (
                    <tr key={i}>
                      <td>
                        <input type={'checkbox'}
                                checked={isSelected(e.key)}
                                onChange={(event) => {
                                  toggleSelected(e.key)
                                }}
                        />
                      </td>
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
                          }}/>
            </>
      }
    </div>
}
