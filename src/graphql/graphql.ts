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

export type Map = {
  __typename?: 'Map';
  error?: Maybe<Scalars['String']>;
  fd?: Maybe<Scalars['Int']>;
  flags?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  isPinned?: Maybe<Scalars['Boolean']>;
  keySize?: Maybe<Scalars['Int']>;
  maxEntries?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  valueSize?: Maybe<Scalars['Int']>;
};

export type Program = {
  __typename?: 'Program';
  btfId?: Maybe<Scalars['Int']>;
  error?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  maps: Array<Map>;
  name?: Maybe<Scalars['String']>;
  runCount?: Maybe<Scalars['Int']>;
  runTime?: Maybe<Scalars['Float']>;
  tag?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  maps: Array<Map>;
  programs: Array<Program>;
};

export type NavigationQueryVariables = Exact<{ [key: string]: never; }>;


export type NavigationQuery = { __typename?: 'Query', programs: Array<{ __typename?: 'Program', id: number, name?: string | null, type: string, tag?: string | null, runTime?: number | null, runCount?: number | null, btfId?: number | null, error?: string | null }>, maps: Array<{ __typename?: 'Map', id: number, error?: string | null, name?: string | null, type?: string | null, fd?: number | null, flags?: number | null, isPinned?: boolean | null, keySize?: number | null, valueSize?: number | null, maxEntries?: number | null }> };


export const NavigationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Navigation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"programs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"runTime"}},{"kind":"Field","name":{"kind":"Name","value":"runCount"}},{"kind":"Field","name":{"kind":"Name","value":"btfId"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}},{"kind":"Field","name":{"kind":"Name","value":"maps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fd"}},{"kind":"Field","name":{"kind":"Name","value":"flags"}},{"kind":"Field","name":{"kind":"Name","value":"isPinned"}},{"kind":"Field","name":{"kind":"Name","value":"keySize"}},{"kind":"Field","name":{"kind":"Name","value":"valueSize"}},{"kind":"Field","name":{"kind":"Name","value":"maxEntries"}}]}}]}}]} as unknown as DocumentNode<NavigationQuery, NavigationQueryVariables>;