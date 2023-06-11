import {GetMapQuery, IdType} from "../../graphql/graphql";
import {Flash, Spinner} from "@primer/react";
import {GraphView} from "../../components/graphview/GraphView";
import React from "react";
import {useConnectedGraphQuery} from "../../components/graphview/query";


export function GraphSection({id}: { id: number }) {
  const {loading, error, data} = useConnectedGraphQuery(id, IdType.Map);

  if (loading) return <Spinner/>;
  if (error || !data) return <Flash variant="danger">{error ? error.message : "empty result"}</Flash>;

  return <GraphView maps={data.connectedGraph.maps} programs={data.connectedGraph.programs}/>
}