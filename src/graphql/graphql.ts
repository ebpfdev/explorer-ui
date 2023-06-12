/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ConnectedGraph = {
  __typename?: 'ConnectedGraph';
  maps: Array<Map>;
  programs: Array<Program>;
};

export enum IdType {
  Map = 'MAP',
  Program = 'PROGRAM'
}

export type Map = {
  __typename?: 'Map';
  entries: Array<MapEntry>;
  entriesCount: Scalars['Int'];
  error?: Maybe<Scalars['String']>;
  flags?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  isLookupSupported: Scalars['Boolean'];
  isPerCPU: Scalars['Boolean'];
  isPinned: Scalars['Boolean'];
  keySize?: Maybe<Scalars['Int']>;
  maxEntries?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  pins?: Maybe<Array<Scalars['String']>>;
  programs: Array<Program>;
  type: Scalars['String'];
  valueSize?: Maybe<Scalars['Int']>;
};


export type MapEntriesArgs = {
  keyFormat?: InputMaybe<MapEntryFormat>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  valueFormat?: InputMaybe<MapEntryFormat>;
};

export type MapEntry = {
  __typename?: 'MapEntry';
  cpuValues: Array<Scalars['String']>;
  key: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export enum MapEntryFormat {
  Hex = 'HEX',
  Number = 'NUMBER',
  String = 'STRING'
}

export type MapPinningResult = {
  __typename?: 'MapPinningResult';
  error?: Maybe<Scalars['String']>;
};

export type MapUpdateValueResult = {
  __typename?: 'MapUpdateValueResult';
  error?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  pinMap?: Maybe<MapPinningResult>;
  updateMapValue?: Maybe<MapUpdateValueResult>;
};


export type MutationPinMapArgs = {
  id: Scalars['Int'];
  path: Scalars['String'];
};


export type MutationUpdateMapValueArgs = {
  cpu?: InputMaybe<Scalars['Int']>;
  key: Scalars['String'];
  keyFormat: MapEntryFormat;
  mapId: Scalars['Int'];
  value: Scalars['String'];
  valueFormat: MapEntryFormat;
};

export type Program = {
  __typename?: 'Program';
  btfId?: Maybe<Scalars['Int']>;
  error?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  isPinned?: Maybe<Scalars['Boolean']>;
  maps: Array<Map>;
  name?: Maybe<Scalars['String']>;
  runCount?: Maybe<Scalars['Int']>;
  runTime?: Maybe<Scalars['Float']>;
  tag?: Maybe<Scalars['String']>;
  tasks: Array<Task>;
  type: Scalars['String'];
  verifierLog?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  connectedGraph: ConnectedGraph;
  map: Map;
  maps: Array<Map>;
  program: Program;
  programs: Array<Program>;
};


export type QueryConnectedGraphArgs = {
  from: Scalars['Int'];
  fromType: IdType;
};


export type QueryMapArgs = {
  id: Scalars['Int'];
};


export type QueryProgramArgs = {
  id: Scalars['Int'];
};

export type Task = {
  __typename?: 'Task';
  fd: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  pid: Scalars['Int'];
  probeAddr?: Maybe<Scalars['String']>;
  probeOffset?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};

export type ConnectedGraphQueryVariables = Exact<{
  id: Scalars['Int'];
  type: IdType;
}>;


export type ConnectedGraphQuery = { __typename?: 'Query', connectedGraph: { __typename?: 'ConnectedGraph', programs: Array<{ __typename?: 'Program', id: number, type: string, name?: string | null, maps: Array<{ __typename?: 'Map', id: number }> }>, maps: Array<{ __typename?: 'Map', id: number, type: string, name?: string | null }> } };

export type NavigationQueryVariables = Exact<{ [key: string]: never; }>;


export type NavigationQuery = { __typename?: 'Query', programs: Array<{ __typename?: 'Program', id: number, error?: string | null, name?: string | null, type: string, tag?: string | null, runTime?: number | null, runCount?: number | null, btfId?: number | null }>, maps: Array<{ __typename?: 'Map', id: number, error?: string | null, name?: string | null, type: string, flags?: number | null, isPinned: boolean, keySize?: number | null, valueSize?: number | null, maxEntries?: number | null }> };

export type GetMapEntriesQueryVariables = Exact<{
  mapId: Scalars['Int'];
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  keyFormat: MapEntryFormat;
  valueFormat: MapEntryFormat;
}>;


export type GetMapEntriesQuery = { __typename?: 'Query', map: { __typename?: 'Map', isPerCPU: boolean, entriesCount: number, entries: Array<{ __typename?: 'MapEntry', key: string, value?: string | null, cpuValues: Array<string> }> } };

export type UpdateMapValueMutationVariables = Exact<{
  mapId: Scalars['Int'];
  key: Scalars['String'];
  cpu?: InputMaybe<Scalars['Int']>;
  value: Scalars['String'];
  keyFormat: MapEntryFormat;
  valueFormat: MapEntryFormat;
}>;


export type UpdateMapValueMutation = { __typename?: 'Mutation', updateMapValue?: { __typename?: 'MapUpdateValueResult', error?: string | null } | null };

export type GetMapQueryVariables = Exact<{
  mapId: Scalars['Int'];
}>;


export type GetMapQuery = { __typename?: 'Query', map: { __typename?: 'Map', id: number, error?: string | null, name?: string | null, type: string, flags?: number | null, isPinned: boolean, pins?: Array<string> | null, keySize?: number | null, valueSize?: number | null, maxEntries?: number | null, entriesCount: number, isPerCPU: boolean, isLookupSupported: boolean, programs: Array<{ __typename?: 'Program', id: number, name?: string | null, type: string }> } };

export type GetProgramQueryVariables = Exact<{
  programId: Scalars['Int'];
}>;


export type GetProgramQuery = { __typename?: 'Query', program: { __typename?: 'Program', id: number, name?: string | null, type: string, tag?: string | null, runTime?: number | null, runCount?: number | null, btfId?: number | null, error?: string | null, maps: Array<{ __typename?: 'Map', id: number, name?: string | null, type: string }>, tasks: Array<{ __typename?: 'Task', pid: number, fd: number, type: string, name?: string | null, probeOffset?: string | null, probeAddr?: string | null }> } };


export const ConnectedGraphDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ConnectedGraph"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IdType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"connectedGraph"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"fromType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"programs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"maps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"maps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ConnectedGraphQuery, ConnectedGraphQueryVariables>;
export const NavigationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Navigation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"programs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"runTime"}},{"kind":"Field","name":{"kind":"Name","value":"runCount"}},{"kind":"Field","name":{"kind":"Name","value":"btfId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"maps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"flags"}},{"kind":"Field","name":{"kind":"Name","value":"isPinned"}},{"kind":"Field","name":{"kind":"Name","value":"keySize"}},{"kind":"Field","name":{"kind":"Name","value":"valueSize"}},{"kind":"Field","name":{"kind":"Name","value":"maxEntries"}}]}}]}}]} as unknown as DocumentNode<NavigationQuery, NavigationQueryVariables>;
export const GetMapEntriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMapEntries"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mapId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"keyFormat"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MapEntryFormat"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"valueFormat"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MapEntryFormat"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"map"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mapId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isPerCPU"}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"keyFormat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"keyFormat"}}},{"kind":"Argument","name":{"kind":"Name","value":"valueFormat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"valueFormat"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"cpuValues"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entriesCount"}}]}}]}}]} as unknown as DocumentNode<GetMapEntriesQuery, GetMapEntriesQueryVariables>;
export const UpdateMapValueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMapValue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mapId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cpu"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"keyFormat"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MapEntryFormat"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"valueFormat"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MapEntryFormat"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMapValue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mapId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mapId"}}},{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"cpu"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cpu"}}},{"kind":"Argument","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}},{"kind":"Argument","name":{"kind":"Name","value":"keyFormat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"keyFormat"}}},{"kind":"Argument","name":{"kind":"Name","value":"valueFormat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"valueFormat"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<UpdateMapValueMutation, UpdateMapValueMutationVariables>;
export const GetMapDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMap"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mapId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"map"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mapId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"flags"}},{"kind":"Field","name":{"kind":"Name","value":"isPinned"}},{"kind":"Field","name":{"kind":"Name","value":"pins"}},{"kind":"Field","name":{"kind":"Name","value":"keySize"}},{"kind":"Field","name":{"kind":"Name","value":"valueSize"}},{"kind":"Field","name":{"kind":"Name","value":"maxEntries"}},{"kind":"Field","name":{"kind":"Name","value":"entriesCount"}},{"kind":"Field","name":{"kind":"Name","value":"isPerCPU"}},{"kind":"Field","name":{"kind":"Name","value":"isLookupSupported"}},{"kind":"Field","name":{"kind":"Name","value":"programs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<GetMapQuery, GetMapQueryVariables>;
export const GetProgramDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProgram"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"programId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"program"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"programId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"runTime"}},{"kind":"Field","name":{"kind":"Name","value":"runCount"}},{"kind":"Field","name":{"kind":"Name","value":"btfId"}},{"kind":"Field","name":{"kind":"Name","value":"maps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pid"}},{"kind":"Field","name":{"kind":"Name","value":"fd"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"probeOffset"}},{"kind":"Field","name":{"kind":"Name","value":"probeAddr"}}]}}]}}]}}]} as unknown as DocumentNode<GetProgramQuery, GetProgramQueryVariables>;