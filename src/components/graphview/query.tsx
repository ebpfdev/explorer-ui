import {gql} from "../../graphql";
import {useQuery} from "@apollo/client";
import {IdType} from "../../graphql/graphql";

const GQL_CONNECTED_GRAPH_QUERY = gql(/* GraphQL */ `
  query ConnectedGraph($id: Int!, $type: IdType!) {
    connectedGraph(from: $id, fromType: $type) {
      programs {
        id
        type
        name
        maps {
          id
        }
      }
      maps {
        id
        type
        name
      }
    }
  }
`);

export function useConnectedGraphQuery(id: number, type: IdType) {
  return useQuery(GQL_CONNECTED_GRAPH_QUERY, {
    variables: {id, type},
  });
}
