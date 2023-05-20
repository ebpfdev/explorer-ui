import {useParams, useSearchParams} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {gql} from "../../graphql";
import React, {useCallback, useEffect} from "react";
import {navigationActions} from "../../store/navigation";
import {useAppDispatch} from "../../store/root";
import {GetMapQuery, MapEntryFormat, Program} from "../../graphql/graphql";
import {Box, Button, Flash, Pagehead, Pagination, Select, Spinner, TreeView} from "@primer/react";
import {ProgramNavItem} from "../../navigation/navigation";
import "./style.css";
import {useSearchParamsState} from "../../utils/searchParamHook";


const GQL_MAP_QUERY = gql(/* GraphQL */ `
    query GetMap($mapId: Int!) {
        map(id: $mapId) {
            id
            error

            name
            type
            flags
            isPinned
            keySize
            valueSize
            maxEntries
            
            entriesCount
            
            isPerCPU
            isLookupSupported

            programs {
                id
                name
                type
            }
        }
    }
`);

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

function MapPageContent({map: {
    flags, id, isPinned, keySize, maxEntries,
    name, programs, type, valueSize, entriesCount,
    isPerCPU, isLookupSupported
  }}: { map: GetMapQuery["map"] }) {

  const propsBoxProps = {
    flexGrow: 1,
    p: 1,
  }

  const [searchParams, setSearchParams] = useSearchParams();

  const [showEntries, setShowEntries] = useSearchParamsState('show_entries', false, strValue => strValue === 'true');
  const [keyFormat, setKeyFormat] = useSearchParamsState('fkey', MapEntryFormat.Hex, strValue => strValue as MapEntryFormat);
  const [valueFormat, setValueFormat] = useSearchParamsState('fvalue', MapEntryFormat.Hex, strValue => strValue as MapEntryFormat);

  const [page, setPage] = useSearchParamsState('page', 1, strValue => parseInt(strValue));

  const toggleShowEntries = useCallback(() => {
    if (showEntries) {
      setShowEntries('false')
    } else {
      setShowEntries('true')
    }
  }, [setShowEntries]);

  const pageSize = 32;

  const {loading, error, data} = useQuery(GQL_MAP_QUERY_ENTRIES, {
    variables: {
      mapId: id,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      keyFormat: keyFormat,
      valueFormat: valueFormat,
    },
    skip: !showEntries
  });

  const mapEntries = data?.map.entries || [];
  const mapEntriesCount = data?.map.entriesCount || 0;

  const pageCount = Math.ceil(mapEntriesCount / pageSize);

  const cpus = !isPerCPU ? 1 : Math.max(mapEntries[0]?.cpuValues?.length || 1, 1);

  return <div>
    <Pagehead><b>{name || <i>unnamed</i>}</b> <sup>id {id}</sup></Pagehead>
    <Box sx={{display: 'flex'}}>
      <Box sx={propsBoxProps}>
        <h3>Type</h3>
        <pre>{type}</pre>
      </Box>
      <Box sx={propsBoxProps}>
        <h3>Size</h3>
        <pre>Key: {keySize} bytes</pre>
        <pre>Value: {valueSize} bytes</pre>
        <pre>Entries: {entriesCount} / {maxEntries}</pre>
        <pre>Max space: {(keySize!+valueSize!)*maxEntries!} bytes</pre>
      </Box>
      <Box sx={propsBoxProps}>
        <h3>Flags</h3>
        <pre>{!flags ? 'none' : flags}</pre>
      </Box>
      <Box sx={propsBoxProps}>
        <h3>Pinned</h3>
        <pre>{isPinned ? 'yes' : 'no'}</pre>
      </Box>
    </Box>

    {!isLookupSupported ? null :
      <div>
        <Box sx={{display: 'flex'}}>
          <Box>
            <h2>Entries </h2>
          </Box>
          <Box>
            <Button onClick={() => toggleShowEntries()}>{showEntries ? 'Hide' : 'Show'} entries</Button>
          </Box>
        </Box>

        {!showEntries ? null : (
          loading ? <p>Loading...</p> :
            error ? <p>Error: {error.message}</p> :
              <>
                Total entries: {mapEntriesCount}
                <table className={'map-entries'}>
                  <thead>
                    <tr>
                      <td rowSpan={cpus > 1 ? 2 : 1}>
                        <span>Key</span>
                        <span style={{float: 'right'}}>
                          <Select style={{width: '100px'}}
                            onChange={(event) => setKeyFormat(event.target.value as MapEntryFormat)}
                          >
                            <Select.Option value={MapEntryFormat.Hex} selected={keyFormat == MapEntryFormat.Hex}>HEX</Select.Option>
                            <Select.Option value={MapEntryFormat.String} selected={keyFormat == MapEntryFormat.String}>String</Select.Option>
                            <Select.Option value={MapEntryFormat.Number} selected={keyFormat == MapEntryFormat.Number}>Number</Select.Option>
                          </Select>
                        </span>
                      </td>
                      <td colSpan={cpus}>
                        <span>Value</span>
                        <span style={{float: 'right'}}>
                          <Select style={{width: '100px'}}
                            onChange={(event) => setValueFormat(event.target.value as MapEntryFormat)}
                          >
                            <Select.Option value={MapEntryFormat.Hex} selected={valueFormat == MapEntryFormat.Hex}>HEX</Select.Option>
                            <Select.Option value={MapEntryFormat.String} selected={valueFormat == MapEntryFormat.String}>String</Select.Option>
                            <Select.Option value={MapEntryFormat.Number} selected={valueFormat == MapEntryFormat.Number}>Number</Select.Option>
                          </Select>
                        </span>
                      </td>
                    </tr>
                    {cpus <= 1 ? null :
                      <tr>
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
                <Pagination pageCount={pageCount} currentPage={page}
                            onPageChange={(e, pageNum) => {
                                            setPage(pageNum.toString());
                                            e.preventDefault()
                                          }} />
              </>
        )}
      </div>
    }
    <div>
      <h2>Bounded to programs:</h2>
      {
        programs.length == 0 ? <p>No programs</p> :
          <TreeView>
            {programs.map((p) => <ProgramNavItem key={p.id} prog={p} />)}
          </TreeView>
      }
    </div>
  </div>
}

export function MapPage() {
  const dispatch = useAppDispatch();
  const {mapId} = useParams();
  const {loading, error, data} = useQuery(GQL_MAP_QUERY, {
    variables: {
      mapId: mapId ? parseInt(mapId) : 0
    }
  });

  // send notification on mount
  useEffect(() => {
    if (data?.map?.programs) {
      dispatch(navigationActions.highlightProgs({
        programs: data.map.programs.map((m: Pick<Program, 'id'>) => m.id)
      }));
    }
    return () => {
      dispatch(navigationActions.highlightProgs({
        programs: []
      }));
    }
  });

  return (
    loading ? <Spinner size="large" /> :
      error ? <Flash variant="danger">{error.message}</Flash> :
              <MapPageContent map={data!.map}/>
  );
}