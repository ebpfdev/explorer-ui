import {GetMapQuery} from "../../graphql/graphql";
import {Box, TreeView} from "@primer/react";
import {ProgramNavItem} from "../../navigation/navigation";
import React from "react";


export function OverviewSection({map: {
  flags, isPinned, pins, keySize, maxEntries,
  programs, type, valueSize, entriesCount,
  isLookupSupported
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
        {!isLookupSupported ? null :
          <pre>Entries: {entriesCount} / {maxEntries}</pre>}
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
    {!isPinned ? null :
      <div>
        <h3>Pins</h3>
        <ul>
          {(pins || []).map((p) => <li key={p}><pre>{p}</pre></li>)}
        </ul>
      </div>
    }
    <div>
      <h3>Programs using this map</h3>
      {
        programs.length === 0 ? <p>No programs</p> :
          <TreeView>
            {programs.map((p) => <ProgramNavItem key={p.id} prog={p} />)}
          </TreeView>
      }
    </div>
  </>
}
