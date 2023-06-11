import {useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {gql} from "../../graphql";
import React, {useEffect} from "react";
import {navigationActions} from "../../store/navigation";
import {useAppDispatch} from "../../store/root";
import {Program} from "../../graphql/graphql";
import {Flash, Pagehead, SegmentedControl, Spinner} from "@primer/react";
import "./style.css";
import {EyeIcon, GitCompareIcon, ServerIcon} from "@primer/octicons-react";
import {mapEntriesLink, mapGraphLink, mapOverviewLink} from "../../navigation/links";
import {OverviewSection} from "./OverviewSection";
import {GraphSection} from "./GraphSection";
import {EntriesSection} from "./EntriesSection";


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

  if (loading) return <Spinner size={"large"} />;
  else if (error || !data) return <Flash variant="danger">{error ? error.message : "empty result"}</Flash>;

  const {id, name} = data.map;

  return (
    <div>
      <Pagehead>
        <b>{name || <i>unnamed</i>}</b> <sup>id {id}</sup>
        <span style={{marginLeft: '10px'}} />
        <SegmentedControl aria-label="File view">
          <SegmentedControl.Button
            selected={!section}
            onClick={() => navigate(mapOverviewLink(id))}
            leadingIcon={EyeIcon}>&nbsp;Overview</SegmentedControl.Button>
          <SegmentedControl.Button
            selected={section === 'entries'}
            onClick={() => navigate(mapEntriesLink(id))}
            leadingIcon={ServerIcon}>&nbsp;Entries
          </SegmentedControl.Button>
          <SegmentedControl.Button
            selected={section === 'graph'}
            onClick={() => navigate(mapGraphLink(id))}
            leadingIcon={GitCompareIcon}>&nbsp;Graph
          </SegmentedControl.Button>
        </SegmentedControl>
      </Pagehead>
      {
        section === 'entries' ? <EntriesSection map={data!.map} />
        : section === 'graph' ? <GraphSection id={id} />
        : <OverviewSection map={data.map} />
      }
    </div>
  );
}