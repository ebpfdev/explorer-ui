import {GetMapQuery, MapEntryFormat} from "../../graphql/graphql";
import {useSearchParamsState} from "../../utils/searchParamHook";
import {useQuery} from "@apollo/client";
import {FileCodeIcon, NumberIcon, TypographyIcon} from "@primer/octicons-react";
import {ActionList, ActionMenu, Pagination} from "@primer/react";
import React from "react";
import {gql} from "../../graphql";


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

export function EntriesSection({map: {
  id, type, valueSize,
  isPerCPU, isLookupSupported
}}: { map: GetMapQuery["map"] }) {

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

  return !isLookupSupported
    ? <>Lookup is not implemented for map type <b>{type}</b></>
    :
    <div>
      {
        loading ? <p>Loading...</p> :
          error ? <p>Error: {error.message}</p> :
            <>
              Total entries: {mapEntriesCount}
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
                  <tbody>
                  {mapEntries.map((e, i) => (
                    <tr key={i}>
                      <td>{e.key}</td>
                      {cpus <= 1 ? <td>{e.value}</td> :
                        Array(cpus).fill(0).map((_, i) => <td key={i}>{e.cpuValues[i] || 'n/a'}</td>)
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
