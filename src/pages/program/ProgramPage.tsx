import {useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {gql} from "../../graphql";
import React, {useEffect} from "react";
import {navigationActions} from "../../store/navigation";
import {useAppDispatch} from "../../store/root";
import {Flash, Pagehead, SegmentedControl, Spinner} from "@primer/react";
import {OverviewSection} from "./OverviewSection";
import {programGraphLink, programOverviewLink} from "../../navigation/links";
import {EyeIcon, GitCompareIcon} from "@primer/octicons-react";
import {GraphSection} from "./GraphSection";

const GQL_PROGRAM_QUERY = gql(/* GraphQL */ `
  query GetProgram($programId: Int!) {
    program(id: $programId) {
      id
      name
      type
      tag
      runTime
      runCount
      btfId
      maps {
        id
        name
        type
      }
      error
      tasks {
        pid
        fd
        type
        name
        probeOffset
        probeAddr
      }
    }
  }
`);


export function ProgramPage({section}: {section?: string}) {
  const {programId} = useParams();
  const dispatch = useAppDispatch();
  const {loading, error, data} = useQuery(GQL_PROGRAM_QUERY, {
    variables: {
      programId: programId ? parseInt(programId) : 0
    }
  });
  const navigate = useNavigate();

  // send notification on mount
  useEffect(() => {
    if (data?.program?.maps) {
      dispatch(navigationActions.highlightMaps({
        maps: data.program.maps.map((m: any) => m.id as number)
      }));
    }

    return () => {
      dispatch(navigationActions.highlightMaps({
        maps: []
      }));
    }
  }, [dispatch, data]);

  if (loading) return <Spinner size={"large"} />;
  else if (error || !data) return <Flash variant="danger">{error ? error.message : "empty result"}</Flash>;

  const {id, name} = data.program;

  return (
    <div>
      <Pagehead>
        <b>{name || <i>unnamed</i>}</b> <sup>id {id}</sup>
        <span style={{marginLeft: '10px'}} />
        <SegmentedControl aria-label="File view">
          <SegmentedControl.Button
            selected={!section}
            onClick={() => navigate(programOverviewLink(id))}
            leadingIcon={EyeIcon}>&nbsp;Overview</SegmentedControl.Button>
          <SegmentedControl.Button
            selected={section === 'graph'}
            onClick={() => navigate(programGraphLink(id))}
            leadingIcon={GitCompareIcon}>&nbsp;Graph
          </SegmentedControl.Button>
        </SegmentedControl>
      </Pagehead>
      {
          section === 'graph' ? <GraphSection id={id} />
            : <OverviewSection program={data.program} />
      }
    </div>
  );
}