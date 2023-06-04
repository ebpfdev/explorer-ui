import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {gql} from "../../graphql";
import React, {useCallback, useEffect} from "react";
import {navigationActions} from "../../store/navigation";
import {useAppDispatch} from "../../store/root";
import {GetProgramQuery} from "../../graphql/graphql";
import {Box, Flash, Pagehead, Spinner, TreeView} from "@primer/react";
import {MapNavItem} from "../../navigation/navigation";
import {formatSeconds} from "./duration";

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
        }
    }
`);

function ProgramPageContent({program: {id, name, type, tag, runTime, runCount, btfId, maps}}: {
  program: GetProgramQuery['program']
}) {
  const propsBoxProps = {
    flexGrow: 1,
    p: 1,
  }
  const Property = useCallback(({name, children}: any) => {
    return <Box sx={propsBoxProps}>
      <h3>{name}</h3>
      {children}
    </Box>
  }, []);

  return <div>
    <Pagehead><b>{name || <i>unnamed</i>}</b> <sup>id {id}</sup></Pagehead>
    <Box sx={{display: 'flex'}}>
      <Property name="Type">
        <pre>{type}</pre>
      </Property>
      <Property name="Tag">
        <pre>{tag}</pre>
      </Property>
      <Property name="Metrics">
        <pre>Run time: {formatSeconds(runTime || 0)}</pre>
        <pre>Run count: {runCount}</pre>
        <pre>Avg. time per run: {formatSeconds((runTime || 0) / (runCount || 1))}</pre>
      </Property>
      <Property name="BTF">
        <pre>{btfId}</pre>
      </Property>
    </Box>
    <div>
      <h3>Used maps</h3>
      {
        maps.length == 0 ? <p>No maps</p> :
          <TreeView>
            {maps.map((m) => <MapNavItem key={m.id} map={m}/>)}
          </TreeView>
      }
    </div>
  </div>
}

export function ProgramPage() {
  const {programId} = useParams();
  const dispatch = useAppDispatch();
  const {loading, error, data} = useQuery(GQL_PROGRAM_QUERY, {
    variables: {
      programId: programId ? parseInt(programId) : 0
    }
  });

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

  return (
    loading ? <Spinner size="large" /> :
      error ? <Flash variant="danger">{error.message}</Flash> :
        <ProgramPageContent program={data!.program}/>
  );
}