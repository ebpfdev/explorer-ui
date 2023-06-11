import {Header, PageLayout} from '@primer/react';
import React from 'react';
import {Outlet} from "react-router-dom";
import {MarkGithubIcon} from "@primer/octicons-react";
import {Sidebar} from "../navigation/sidebar";


function App() {

  return (
    <PageLayout containerWidth={'full'} padding={'none'} rowGap={"none"}>
      <PageLayout.Header>
        <Header>
          <Header.Item>
            <Header.Link href="#">
              <span>eBPF explorer</span>
            </Header.Link>
          </Header.Item>
          <Header.Item full></Header.Item>
          <Header.Item mr={0}>
            <Header.Link href="https://github.com/ebpfdev/explorer">
              <MarkGithubIcon />
            </Header.Link>
          </Header.Item>
        </Header>
      </PageLayout.Header>
      <PageLayout.Pane position="start" padding={'normal'} positionWhenNarrow={'end'}>
        <Sidebar />
      </PageLayout.Pane>
      <PageLayout.Content>
        <Outlet/>
      </PageLayout.Content>
    </PageLayout>
  );
}

export default App;
