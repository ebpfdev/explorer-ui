import {NavLink, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {gql} from "../../graphql";
import React, {useCallback, useEffect} from "react";
import {navigationActions} from "../../store/navigation";
import {useAppDispatch} from "../../store/root";
import {GetMapQuery, MapEntryFormat, Program} from "../../graphql/graphql";
import {
  ActionList,
  ActionMenu,
  Box,
  Button,
  Flash, IconButton,
  Link,
  Pagehead,
  Pagination,
  SegmentedControl,
  Select,
  Spinner, sx,
  TreeView
} from "@primer/react";
import {ProgramNavItem} from "../../navigation/navigation";
import "./style.css";
import {useSearchParamsState} from "../../utils/searchParamHook";
import {
  EyeIcon,
  FileCodeIcon,
  KebabHorizontalIcon,
  NumberIcon,
  PencilIcon,
  PeopleIcon,
  ServerIcon, TypographyIcon
} from "@primer/octicons-react";
import {mapEntriesLink, mapOverviewLink} from "../../navigation/links";
import styled from "styled-components";


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

function MapPage_Overview({map: {
    flags, id, isPinned, keySize, maxEntries,
    name, programs, type, valueSize, entriesCount,
    isPerCPU, isLookupSupported
  }}: { map: GetMapQuery["map"] }) {

  const propsBoxProps = {
    flexGrow: 1,
    p: 1,
  }

  return <>
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
    <div>
      <h3>Programs using this map</h3>
      {
        programs.length == 0 ? <p>No programs</p> :
          <TreeView>
            {programs.map((p) => <ProgramNavItem key={p.id} prog={p} />)}
          </TreeView>
      }
    </div>
  </>
}

function MapPage_Entries({map: {
  flags, id, isPinned, keySize, maxEntries,
  name, programs, type, valueSize, entriesCount,
  isPerCPU, isLookupSupported
}}: { map: GetMapQuery["map"] }) {

  const [searchParams, setSearchParams] = useSearchParams();

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

  const pageCount = Math.ceil(mapEntriesCount / pageSize);

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

export function MapPage({section}: {section?: string}) {

  const dispatch = useAppDispatch();
  const {mapId} = useParams();
  const {loading, error, data} = useQuery(GQL_MAP_QUERY, {
    variables: {
      mapId: mapId ? parseInt(mapId) : 0
    }
  });

  const navigate = useNavigate();

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
              <div>
                <Pagehead>
                  <b>{data!.map.name || <i>unnamed</i>}</b> <sup>id {data!.map.id}</sup>
                  <span style={{marginLeft: '10px'}} />
                  <SegmentedControl aria-label="File view">
                    <SegmentedControl.Button
                      selected={section !== 'entries'}
                      onClick={() => navigate(mapOverviewLink(data!.map.id))}
                      leadingIcon={EyeIcon}>&nbsp;Overview</SegmentedControl.Button>
                    <SegmentedControl.Button
                      selected={section === 'entries'}
                      onClick={() => navigate(mapEntriesLink(data!.map.id))}
                      leadingIcon={ServerIcon}>&nbsp;Entries
                    </SegmentedControl.Button>
                  </SegmentedControl>
                </Pagehead>
                {
                  section === 'entries'
                    ? <MapPage_Entries map={data!.map} />
                    : <MapPage_Overview map={data!.map} />
                }
              </div>
  );
}