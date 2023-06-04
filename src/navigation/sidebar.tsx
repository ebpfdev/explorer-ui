import {TreeView} from "@primer/react";
import {MapNavItem, ProgramNavItem} from "./navigation";
import React, {useState} from "react";
import {gql} from "../graphql";
import {useQuery} from "@apollo/client";


const GQL_QUERY_NAVIGATION = gql(/* GraphQL */ `
    query Navigation {
        programs {
            id
            error
            name
            type
            tag
            runTime
            runCount
            btfId
        }
        maps{
            id
            error
            name
            type
            flags
            isPinned
            keySize
            valueSize
            maxEntries
        }
    }
`);

export function Sidebar() {
  const [mapsOpened, setMapsOpened] = useState(true);
  const [progsOpened, setProgsOpened] = useState(true);

  const {loading, error, data} = useQuery(GQL_QUERY_NAVIGATION, {
    pollInterval: 500
  });

  return <nav aria-label="Files">
    <TreeView aria-label="Files">
      <TreeView.Item id="maps" expanded={mapsOpened} onExpandedChange={setMapsOpened}>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon/>
        </TreeView.LeadingVisual>
        Maps
        <TreeView.SubTree state={loading ? 'loading' : 'done'}>
          {data?.maps && (
            data.maps.map((map: any) => <MapNavItem key={map.id} map={map} highlight={true} />)
          )}
        </TreeView.SubTree>
      </TreeView.Item>
      <TreeView.Item id="progs" expanded={progsOpened} onExpandedChange={setProgsOpened}>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon/>
        </TreeView.LeadingVisual>
        Programs
        <TreeView.SubTree state={loading ? 'loading' : 'done'}>
          {data?.programs && (
            data.programs.map((prog: any) => <ProgramNavItem key={prog.id} prog={prog} highlight={true} />)
          )}
        </TreeView.SubTree>
      </TreeView.Item>
    </TreeView>
  </nav>;
}