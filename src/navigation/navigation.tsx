import React from "react";
import {RootState, useAppSelector} from "../store/root";
import {useMatch, useNavigate, useResolvedPath} from "react-router-dom";
import {programLink} from "./links";
import {StyledOcticon, TreeView} from "@primer/react";
import {ArrowSwitchIcon, FileBinaryIcon, InboxIcon, VersionsIcon} from "@primer/octicons-react";
import {Map as EMap, Program} from "../graphql/graphql";



export function ProgramNavItem({prog, highlight} : {prog: Pick<Program, 'id' | 'name'>, highlight?: boolean}) {
  const highlightedProgs = useAppSelector((state: RootState) => state.navigation.highlightedProgs);

  const navigate = useNavigate();
  const link = programLink(prog.id);
  const resolved = useResolvedPath(link)
  const isCurrent = useMatch({path: resolved.pathname, end: true})

  return (
    <TreeView.Item
      id={prog.id.toString()} key={prog.id}
      aria-current={isCurrent ? 'page' : undefined}
      current={!!isCurrent}
      onSelect={() => navigate(link)}
    >
      <TreeView.LeadingVisual>
        <FileBinaryIcon/>
      </TreeView.LeadingVisual>
      {`ID: ${prog.id} ${prog.name}`}
      {highlight && highlightedProgs.indexOf(prog.id) >= 0 && (
        <TreeView.TrailingVisual>
          <StyledOcticon icon={ArrowSwitchIcon} color="attention.fg" aria-label="modified"/>
        </TreeView.TrailingVisual>
      )}
    </TreeView.Item>
  )
}

export function MapNavItem({map, highlight} : {map: Pick<EMap, 'id' | 'name' | 'type'>, highlight?: boolean}) {
  const highlightedMaps = useAppSelector((state: RootState) => state.navigation.highlightedMaps);

  const navigate = useNavigate();
  const link = `/map/${map.id}`;
  const resolved = useResolvedPath(link);
  const isCurrent = useMatch({path: resolved.pathname, end: true});

  return (
    <TreeView.Item
      id={map.id.toString()} key={map.id}
      aria-current={isCurrent ? 'page' : undefined}
      current={!!isCurrent}
      onSelect={() => navigate(link)}
    >
      <TreeView.LeadingVisual>
        {
          map.type === "PerfEventArray" ? <VersionsIcon/> : <InboxIcon/>
        }
      </TreeView.LeadingVisual>
      {`ID: ${map.id} ${map.name}`}
      {highlight && highlightedMaps.indexOf(map.id) >= 0 && (
        <TreeView.TrailingVisual>
          <StyledOcticon icon={ArrowSwitchIcon} color="attention.fg" aria-label="modified"/>
        </TreeView.TrailingVisual>
      )}
    </TreeView.Item>
  );
}
