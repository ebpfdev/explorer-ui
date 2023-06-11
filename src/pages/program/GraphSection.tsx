import React from "react";
import {IdType} from "../../graphql/graphql";
import {Flash, Spinner} from "@primer/react";
import {useConnectedGraphQuery} from "../../components/graphview/query";
import {GraphView} from "../../components/graphview/GraphView";


export function GraphSection({id}: { id: number }) {
  const {loading, error, data} = useConnectedGraphQuery(id, IdType.Program);

  if (loading) return <Spinner/>;
  if (error || !data) return <Flash variant="danger">{error ? error.message : "empty result"}</Flash>;

  return <GraphView maps={data.connectedGraph.maps} programs={data.connectedGraph.programs}/>
}