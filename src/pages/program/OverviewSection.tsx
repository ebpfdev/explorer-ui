import React, {useCallback} from "react";
import {GetProgramQuery, Task} from "../../graphql/graphql";
import {Box, TreeView} from "@primer/react";
import {MapNavItem} from "../../navigation/navigation";
import {formatSeconds} from "./duration";
import {DataTable, Table} from "@primer/react/drafts";

export function OverviewSection({program: {id, name, type, tag, runTime, runCount, btfId, maps, tasks}}: {
  program: GetProgramQuery['program']
}) {
  const Property = useCallback(({name, children}: any) => {
    return <Box sx={{
      flexGrow: 1,
      p: 1,
    }}>
      <h3>{name}</h3>
      {children}
    </Box>
  }, []);

  return <div>
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
      <h3>Attachments</h3>
      {
        tasks.length === 0 ? <p>No attachments</p> :
          <Table.Container>
            <DataTable
              data={tasks.map((t: Task) => ({...t, id: t.pid + '/' + t.fd}))}
              columns={[
                {
                  header: 'Process ID',
                  field: 'pid',
                },
                {
                  header: 'File descriptor',
                  field: 'fd',
                },
                {
                  header: 'Type',
                  field: 'type',
                },
                {
                  header: 'Function / File',
                  field: 'name',
                },
                {
                  header: 'Probe offset',
                  field: 'probeOffset',
                  renderCell: (t: Task) => <pre>{t.probeOffset}</pre>
                },
                {
                  header: 'Probe address',
                  field: 'probeAddr',
                  renderCell: (t: Task) => <pre>{t.probeAddr}</pre>
                },
              ]} />
          </Table.Container>
      }
    </div>
    <div>
      <h3>Used maps</h3>
      {
        maps.length === 0 ? <p>No maps</p> :
          <TreeView>
            {maps.map((m) => <MapNavItem key={m.id} map={m}/>)}
          </TreeView>
      }
    </div>
  </div>
}
