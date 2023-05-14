import {Header, NavList, PageLayout, StyledOcticon, SubNav, TreeView} from '@primer/react';
import React from 'react';
import {RootState, useAppDispatch, useAppSelector} from "../store/root";
import {navigationActions} from "../store/navigation";
import {useQuery} from "@apollo/client";
import {gql} from "../graphql";

// app props:
// - nav selection

const GQL_QUERY_NAVIGATION = gql(/* GraphQL */ `
    query Navigation {
        programs {
            id
            name
            type
            tag
            runTime
            runCount
            btfId
#            maps {
#                id
#            }
            error
        }
        maps{
            id
            error
            name
            type
            fd
            flags
            isPinned
            keySize
            valueSize
            maxEntries
        }
    }
`);

function App() {
  const dispatch = useAppDispatch();
  const selectedKind = useAppSelector((state: RootState) => state.navigation.selectedKind);

  const { loading, error, data } = useQuery(GQL_QUERY_NAVIGATION, {
    pollInterval: 500
  });
  console.log(data, loading, error);

  return (
    <PageLayout>
      <PageLayout.Header>
        <Header>
          <Header.Item>
            <Header.Link href="#">
              <span>ephy browser</span>
            </Header.Link>
          </Header.Item>
        </Header>
      </PageLayout.Header>
      <PageLayout.Pane position="start">
        <nav aria-label="Files">
          <TreeView aria-label="Files">
            <TreeView.Item id="maps">
              <TreeView.LeadingVisual>
                <TreeView.DirectoryIcon />
              </TreeView.LeadingVisual>
              Maps
              <TreeView.SubTree>
              {data?.maps && (
                data.maps.map((map) => {
                  return (
                    <TreeView.Item id={map.id.toString()} key={map.id}>
                      <TreeView.LeadingVisual>
                        <TreeView.DirectoryIcon />
                      </TreeView.LeadingVisual>
                      {map.name}
                    </TreeView.Item>
                  )
                })
              )}
              </TreeView.SubTree>
            </TreeView.Item>
            <TreeView.Item id="maps">
              <TreeView.LeadingVisual>
                <TreeView.DirectoryIcon />
              </TreeView.LeadingVisual>
              Programs
              <TreeView.SubTree>
                {data?.programs && (
                  data.programs.map((prog) => {
                    return (
                      <TreeView.Item id={prog.id.toString()} key={prog.id}>
                        <TreeView.LeadingVisual>
                          <TreeView.DirectoryIcon />
                        </TreeView.LeadingVisual>
                        {prog.name}
                      </TreeView.Item>
                    )
                  })
                )}
              </TreeView.SubTree>
            </TreeView.Item>
          </TreeView>
        </nav>
      </PageLayout.Pane>
      <PageLayout.Content>
        23123
      </PageLayout.Content>
      <PageLayout.Footer>
        112412412
      </PageLayout.Footer>
    </PageLayout>
  );
}

export default App;
