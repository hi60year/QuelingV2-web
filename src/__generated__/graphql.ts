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
  JSON: any;
  Time: any;
  Upload: any;
};

export type Contest = {
  __typename?: 'Contest';
  attendNum: Scalars['Int'];
  checkInviteCode: Scalars['Boolean'];
  checkTeamNameExist: Scalars['Boolean'];
  createdAt: Scalars['Time'];
  homePage?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  inviteCode: Scalars['String'];
  isIndividual: Scalars['Boolean'];
  mahjongType: MahjongType;
  maxTeamMember: Scalars['Int'];
  minTeamMember: Scalars['Int'];
  name: Scalars['String'];
  platformEngine?: Maybe<Scalars['JSON']>;
  players: Array<Player>;
  status: ContestStatus;
  teams: Array<Team>;
};


export type ContestCheckInviteCodeArgs = {
  inviteCode: Scalars['String'];
};


export type ContestCheckTeamNameExistArgs = {
  name: Scalars['String'];
};


export type ContestInviteCodeArgs = {
  authorizationCode: Scalars['String'];
};

export enum ContestStatus {
  End = 'End',
  Holding = 'Holding',
  Registering = 'Registering'
}

export type InviteCodeNotMatchError = {
  __typename?: 'InviteCodeNotMatchError';
  msg: Scalars['String'];
};

export type MahjongSoulRankingInfo = {
  __typename?: 'MahjongSoulRankingInfo';
  ranking3?: Maybe<Scalars['Int']>;
  ranking4?: Maybe<Scalars['Int']>;
};

export enum MahjongType {
  Com = 'COM',
  Riichi = 'Riichi'
}

export type MaxTeamMemberExceededError = {
  __typename?: 'MaxTeamMemberExceededError';
  maxTeamMember: Scalars['Int'];
  msg: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  registerNewTeam: TeamRegistrationResult;
};


export type MutationRegisterNewTeamArgs = {
  inviteCode?: InputMaybe<Scalars['String']>;
  registrationPayload?: InputMaybe<TeamRegistrationPayload>;
};

export enum Platform {
  Mahjongsoul = 'Mahjongsoul',
  Tenhou = 'Tenhou',
  Tziakcha = 'Tziakcha'
}

export type PlatformInfo = {
  __typename?: 'PlatformInfo';
  name: Scalars['String'];
  platform: Platform;
  rankingInfo?: Maybe<RankingInfo>;
  uid?: Maybe<Scalars['String']>;
};

export type PlatformInfoPayload = {
  name: Scalars['String'];
  pt3?: InputMaybe<Scalars['Int']>;
  pt4?: InputMaybe<Scalars['Int']>;
  r3?: InputMaybe<Scalars['Int']>;
  r4?: InputMaybe<Scalars['Int']>;
  ranking3?: InputMaybe<Scalars['Int']>;
  ranking4?: InputMaybe<Scalars['Int']>;
  rankingInfoType: Scalars['String'];
  uid?: InputMaybe<Scalars['String']>;
};

export type Player = {
  __typename?: 'Player';
  contest?: Maybe<Contest>;
  contestId?: Maybe<Scalars['String']>;
  extraInfo?: Maybe<Scalars['JSON']>;
  id?: Maybe<Scalars['ID']>;
  isLeader: Scalars['Boolean'];
  name: Scalars['String'];
  platformInfos: Array<PlatformInfo>;
  professionalCert?: Maybe<Scalars['String']>;
  team?: Maybe<Team>;
  teamId?: Maybe<Scalars['String']>;
};


export type PlayerIsLeaderArgs = {
  teamId: Scalars['String'];
};

export type PlayerPayload = {
  appendix?: InputMaybe<Scalars['Upload']>;
  extraInfo?: InputMaybe<Scalars['JSON']>;
  name: Scalars['String'];
  platformInfos: Array<PlatformInfoPayload>;
};

export type Query = {
  __typename?: 'Query';
  allContests: Array<Contest>;
  allContestsByRule: Array<Contest>;
  allPlayers: Array<Player>;
  comContestNum: Scalars['Int'];
  contestById?: Maybe<Contest>;
  contestNum: Scalars['Int'];
  contestsByName: Array<Contest>;
  playerById?: Maybe<Player>;
  playersByName: Array<Player>;
  riichiContestNum: Scalars['Int'];
};


export type QueryAllContestsArgs = {
  pageNum: Scalars['Int'];
};


export type QueryAllContestsByRuleArgs = {
  pageNum: Scalars['Int'];
  rule?: InputMaybe<MahjongType>;
};


export type QueryAllPlayersArgs = {
  pageNum: Scalars['Int'];
};


export type QueryContestByIdArgs = {
  id: Scalars['ID'];
};


export type QueryContestsByNameArgs = {
  name: Scalars['String'];
};


export type QueryPlayerByIdArgs = {
  id: Scalars['ID'];
};


export type QueryPlayersByNameArgs = {
  name: Scalars['String'];
};

export type RankingInfo = MahjongSoulRankingInfo | TenhouRankingInfo;

export type Team = {
  __typename?: 'Team';
  contestId: Scalars['String'];
  extraInfo?: Maybe<Scalars['JSON']>;
  hasLeader: Scalars['Boolean'];
  id: Scalars['ID'];
  leaderIndex?: Maybe<Scalars['Int']>;
  leaderPlayer?: Maybe<Player>;
  name: Scalars['String'];
  players: Array<Player>;
  status?: Maybe<TeamStatus>;
};

export type TeamNameAlreadyExistError = {
  __typename?: 'TeamNameAlreadyExistError';
  msg: Scalars['String'];
  name: Scalars['String'];
};

export type TeamRegistrationError = InviteCodeNotMatchError | MaxTeamMemberExceededError | TeamNameAlreadyExistError;

export type TeamRegistrationPayload = {
  contestId: Scalars['String'];
  extraInfo?: InputMaybe<Scalars['JSON']>;
  leaderIndex?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  players: Array<PlayerPayload>;
};

export type TeamRegistrationResult = {
  __typename?: 'TeamRegistrationResult';
  authorizationCode?: Maybe<Scalars['String']>;
  error?: Maybe<TeamRegistrationError>;
  teamId?: Maybe<Scalars['String']>;
};

export enum TeamStatus {
  Accepted = 'Accepted',
  Editing = 'Editing',
  Pending = 'Pending',
  Rejected = 'Rejected'
}

export type TenhouRankingInfo = {
  __typename?: 'TenhouRankingInfo';
  ranking3?: Maybe<Scalars['Int']>;
  ranking4?: Maybe<Scalars['Int']>;
};

export type GetContestListQueryVariables = Exact<{
  pageNum: Scalars['Int'];
  rule?: InputMaybe<MahjongType>;
}>;


export type GetContestListQuery = { __typename?: 'Query', allContestsByRule: Array<{ __typename?: 'Contest', name: string, isIndividual: boolean, homePage?: string | null, platformEngine?: any | null, status: ContestStatus, id: string }> };

export type InviteCodeQueryQueryVariables = Exact<{
  contestId: Scalars['ID'];
  inviteCode: Scalars['String'];
}>;


export type InviteCodeQueryQuery = { __typename?: 'Query', contestById?: { __typename?: 'Contest', checkInviteCode: boolean } | null };

export type TeamNameExistQueryQueryVariables = Exact<{
  contestId: Scalars['ID'];
  name: Scalars['String'];
}>;


export type TeamNameExistQueryQuery = { __typename?: 'Query', contestById?: { __typename?: 'Contest', checkTeamNameExist: boolean } | null };

export type SaveTeamMutationVariables = Exact<{
  payload: TeamRegistrationPayload;
  inviteCode: Scalars['String'];
}>;


export type SaveTeamMutation = { __typename?: 'Mutation', registerNewTeam: { __typename?: 'TeamRegistrationResult', authorizationCode?: string | null, error?: { __typename?: 'InviteCodeNotMatchError', msg: string } | { __typename?: 'MaxTeamMemberExceededError', msg: string } | { __typename?: 'TeamNameAlreadyExistError', msg: string } | null } };

export type GetComContestNumQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetComContestNumQueryQuery = { __typename?: 'Query', comContestNum: number };

export type GetRiichiContestNumQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRiichiContestNumQueryQuery = { __typename?: 'Query', riichiContestNum: number };


export const GetContestListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetContestList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNum"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rule"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MahjongType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allContestsByRule"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"rule"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rule"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageNum"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNum"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isIndividual"}},{"kind":"Field","name":{"kind":"Name","value":"homePage"}},{"kind":"Field","name":{"kind":"Name","value":"platformEngine"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"homePage"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetContestListQuery, GetContestListQueryVariables>;
export const InviteCodeQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InviteCodeQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inviteCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contestById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contestId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkInviteCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"inviteCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inviteCode"}}}]}]}}]}}]} as unknown as DocumentNode<InviteCodeQueryQuery, InviteCodeQueryQueryVariables>;
export const TeamNameExistQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TeamNameExistQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contestById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contestId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkTeamNameExist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]}}]} as unknown as DocumentNode<TeamNameExistQueryQuery, TeamNameExistQueryQueryVariables>;
export const SaveTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamRegistrationPayload"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inviteCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerNewTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registrationPayload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}},{"kind":"Argument","name":{"kind":"Name","value":"inviteCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inviteCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authorizationCode"}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNameAlreadyExistError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"msg"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InviteCodeNotMatchError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"msg"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MaxTeamMemberExceededError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"msg"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SaveTeamMutation, SaveTeamMutationVariables>;
export const GetComContestNumQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetComContestNumQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comContestNum"}}]}}]} as unknown as DocumentNode<GetComContestNumQueryQuery, GetComContestNumQueryQueryVariables>;
export const GetRiichiContestNumQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRiichiContestNumQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"riichiContestNum"}}]}}]} as unknown as DocumentNode<GetRiichiContestNumQueryQuery, GetRiichiContestNumQueryQueryVariables>;