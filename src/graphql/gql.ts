/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query ConnectedGraph($id: Int!, $type: IdType!) {\n    connectedGraph(from: $id, fromType: $type) {\n      programs {\n        id\n        type\n        name\n        maps {\n          id\n        }\n      }\n      maps {\n        id\n        type\n        name\n      }\n    }\n  }\n": types.ConnectedGraphDocument,
    "\n  query Navigation {\n    programs {\n      id\n      error\n      name\n      type\n      tag\n      runTime\n      runCount\n      btfId\n    }\n    maps{\n      id\n      error\n      name\n      type\n      flags\n      isPinned\n      keySize\n      valueSize\n      maxEntries\n    }\n  }\n": types.NavigationDocument,
    "\n  query GetMapEntries($mapId: Int!, $offset: Int!, $limit: Int!, $keyFormat: MapEntryFormat!, $valueFormat: MapEntryFormat!) {\n    map(id: $mapId) {\n      isPerCPU\n      entries(offset: $offset, limit: $limit, keyFormat: $keyFormat, valueFormat: $valueFormat) {\n        key\n        value\n        cpuValues\n      }\n      entriesCount\n    }\n}\n": types.GetMapEntriesDocument,
    "\n  mutation UpdateMapValue(\n      $mapId: Int!, $key: String!, $cpu: Int, $value: String!,\n      $keyFormat: MapEntryFormat!, $valueFormat: MapEntryFormat!\n  ) {\n    updateMapValue(mapId: $mapId, key: $key, cpu: $cpu, value: $value, keyFormat: $keyFormat, valueFormat: $valueFormat) {\n      error\n    }\n  }\n": types.UpdateMapValueDocument,
    "\n  query GetMap($mapId: Int!) {\n    map(id: $mapId) {\n      id\n      error\n\n      name\n      type\n      flags\n      isPinned\n      pins\n      keySize\n      valueSize\n      maxEntries\n      \n      entriesCount\n      \n      isPerCPU\n      isLookupSupported\n\n      programs {\n        id\n        name\n        type\n      }\n    }\n  }\n": types.GetMapDocument,
    "\n  query GetProgram($programId: Int!) {\n    program(id: $programId) {\n      id\n      name\n      type\n      tag\n      runTime\n      runCount\n      btfId\n      maps {\n        id\n        name\n        type\n      }\n      error\n      tasks {\n        pid\n        fd\n        type\n        name\n        probeOffset\n        probeAddr\n      }\n    }\n  }\n": types.GetProgramDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ConnectedGraph($id: Int!, $type: IdType!) {\n    connectedGraph(from: $id, fromType: $type) {\n      programs {\n        id\n        type\n        name\n        maps {\n          id\n        }\n      }\n      maps {\n        id\n        type\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query ConnectedGraph($id: Int!, $type: IdType!) {\n    connectedGraph(from: $id, fromType: $type) {\n      programs {\n        id\n        type\n        name\n        maps {\n          id\n        }\n      }\n      maps {\n        id\n        type\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Navigation {\n    programs {\n      id\n      error\n      name\n      type\n      tag\n      runTime\n      runCount\n      btfId\n    }\n    maps{\n      id\n      error\n      name\n      type\n      flags\n      isPinned\n      keySize\n      valueSize\n      maxEntries\n    }\n  }\n"): (typeof documents)["\n  query Navigation {\n    programs {\n      id\n      error\n      name\n      type\n      tag\n      runTime\n      runCount\n      btfId\n    }\n    maps{\n      id\n      error\n      name\n      type\n      flags\n      isPinned\n      keySize\n      valueSize\n      maxEntries\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMapEntries($mapId: Int!, $offset: Int!, $limit: Int!, $keyFormat: MapEntryFormat!, $valueFormat: MapEntryFormat!) {\n    map(id: $mapId) {\n      isPerCPU\n      entries(offset: $offset, limit: $limit, keyFormat: $keyFormat, valueFormat: $valueFormat) {\n        key\n        value\n        cpuValues\n      }\n      entriesCount\n    }\n}\n"): (typeof documents)["\n  query GetMapEntries($mapId: Int!, $offset: Int!, $limit: Int!, $keyFormat: MapEntryFormat!, $valueFormat: MapEntryFormat!) {\n    map(id: $mapId) {\n      isPerCPU\n      entries(offset: $offset, limit: $limit, keyFormat: $keyFormat, valueFormat: $valueFormat) {\n        key\n        value\n        cpuValues\n      }\n      entriesCount\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateMapValue(\n      $mapId: Int!, $key: String!, $cpu: Int, $value: String!,\n      $keyFormat: MapEntryFormat!, $valueFormat: MapEntryFormat!\n  ) {\n    updateMapValue(mapId: $mapId, key: $key, cpu: $cpu, value: $value, keyFormat: $keyFormat, valueFormat: $valueFormat) {\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateMapValue(\n      $mapId: Int!, $key: String!, $cpu: Int, $value: String!,\n      $keyFormat: MapEntryFormat!, $valueFormat: MapEntryFormat!\n  ) {\n    updateMapValue(mapId: $mapId, key: $key, cpu: $cpu, value: $value, keyFormat: $keyFormat, valueFormat: $valueFormat) {\n      error\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMap($mapId: Int!) {\n    map(id: $mapId) {\n      id\n      error\n\n      name\n      type\n      flags\n      isPinned\n      pins\n      keySize\n      valueSize\n      maxEntries\n      \n      entriesCount\n      \n      isPerCPU\n      isLookupSupported\n\n      programs {\n        id\n        name\n        type\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMap($mapId: Int!) {\n    map(id: $mapId) {\n      id\n      error\n\n      name\n      type\n      flags\n      isPinned\n      pins\n      keySize\n      valueSize\n      maxEntries\n      \n      entriesCount\n      \n      isPerCPU\n      isLookupSupported\n\n      programs {\n        id\n        name\n        type\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProgram($programId: Int!) {\n    program(id: $programId) {\n      id\n      name\n      type\n      tag\n      runTime\n      runCount\n      btfId\n      maps {\n        id\n        name\n        type\n      }\n      error\n      tasks {\n        pid\n        fd\n        type\n        name\n        probeOffset\n        probeAddr\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetProgram($programId: Int!) {\n    program(id: $programId) {\n      id\n      name\n      type\n      tag\n      runTime\n      runCount\n      btfId\n      maps {\n        id\n        name\n        type\n      }\n      error\n      tasks {\n        pid\n        fd\n        type\n        name\n        probeOffset\n        probeAddr\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;