import {Header, PageLayout, TreeView} from '@primer/react';
import React, {useState} from 'react';
import {useQuery} from "@apollo/client";
import {gql} from "../graphql";
import {Outlet} from "react-router-dom";
import {MapNavItem, ProgramNavItem} from "../navigation/navigation";

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

function App() {

  const [mapsOpened, setMapsOpened] = useState(true);
  const [progsOpened, setProgsOpened] = useState(true);

  const {loading, error, data} = useQuery(GQL_QUERY_NAVIGATION, {
    pollInterval: 500
  });
  console.log(data, loading, error);

  return (
    <PageLayout>
      <PageLayout.Header>
        <Header>
          <Header.Item>
            <Header.Link href="#">
              <span>eBPF explorer</span>
            </Header.Link>
          </Header.Item>
        </Header>
      </PageLayout.Header>
      <PageLayout.Pane position="start">
        <nav aria-label="Files">
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
        </nav>
      </PageLayout.Pane>
      <PageLayout.Content>
        <Outlet/>
      </PageLayout.Content>
    </PageLayout>
  );
}

export default App;
