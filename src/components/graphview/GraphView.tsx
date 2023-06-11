import React from "react";
import {ConnectedGraphQuery} from "../../graphql/graphql";
import cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
// @ts-ignore
import COSEBilkent from 'cytoscape-cose-bilkent';
// @ts-ignore
import cola from 'cytoscape-cola';

cytoscape.use(COSEBilkent);
cytoscape.use(cola);

interface GraphViewProps {
  maps: ConnectedGraphQuery['connectedGraph']['maps'];
  programs: ConnectedGraphQuery['connectedGraph']['programs'];
}

export function GraphView({maps, programs}: GraphViewProps) {
  const elements: cytoscape.ElementDefinition[] = [];

  maps.forEach((m) => {
    elements.push({
      data: {
        id: `map-${m.id}`,
        label: `MAP ${m.id} ${m.name} (${m.type})`
      }
    });
  });

  programs.forEach((p) => {
    elements.push({
      data: {
        id: `prog-${p.id}`,
        label: `PROG ${p.id} ${p.name} (${p.type})`
      }
    });
    p.maps.forEach((m) => {
      elements.push({
        data: {
          source: `prog-${p.id}`,
          target: `map-${m.id}`
        }
      });
    });
  });

  // const colaLayout = {
  //   name: 'cola',
  //   animate: true,
  //   refresh: 1,
  //   randomize: true,
  //   maxSimulationTime: 60000,
  //
  //   fit: true,
  //   nodeDimensionsIncludeLabels: true,
  //   avoidOverlap: true,
  //   convergenceThreshold: 0.001,
  // }

  const bilkentLayout = {
    name: 'cose-bilkent',
    animate: true,
    refresh: 1,
    nodeDimensionsIncludeLabels: true,
    fit: true,
  }

  return <CytoscapeComponent
    elements={elements}
    layout={bilkentLayout}
    wheelSensitivity={0.25}
    styleEnabled={true}
    style={ {
      outline: '1px solid #ddd',
      width: '100%',
      height: '90vh'
    } } />;
}