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
    "\n    query GetContestList($pageNum: Int!, $rule: MahjongType) {\n        allContestsByRule(rule: $rule, pageNum: $pageNum) {\n            name\n            isIndividual\n            homePage\n            platformEngine\n            status\n            homePage\n            id\n        }\n    }\n": types.GetContestListDocument,
    "\n    query InviteCodeQuery($contestId: ID!, $inviteCode: String!) {\n        contestById(id: $contestId) {\n            checkInviteCode(inviteCode: $inviteCode)\n        }\n    }\n": types.InviteCodeQueryDocument,
    "\n    query TeamNameExistQuery($contestId: ID!, $name: String!) {\n        contestById(id: $contestId) {\n            checkTeamNameExist(name: $name)\n        }\n    }\n": types.TeamNameExistQueryDocument,
    "\n    mutation SaveTeam($payload: TeamRegistrationPayload!, $inviteCode: String!) {\n        registerNewTeam(registrationPayload: $payload, inviteCode: $inviteCode) {\n            authorizationCode\n            error {\n                ... on TeamNameAlreadyExistError {\n                    msg\n                }\n                ... on InviteCodeNotMatchError {\n                    msg\n                }\n                ... on MaxTeamMemberExceededError{\n                    msg\n                }\n            }\n        }\n    }\n": types.SaveTeamDocument,
    "\n    query GetComContestNumQuery {\n        comContestNum\n    }\n": types.GetComContestNumQueryDocument,
    "\n    query GetRiichiContestNumQuery {\n        riichiContestNum\n    }\n": types.GetRiichiContestNumQueryDocument,
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
export function gql(source: "\n    query GetContestList($pageNum: Int!, $rule: MahjongType) {\n        allContestsByRule(rule: $rule, pageNum: $pageNum) {\n            name\n            isIndividual\n            homePage\n            platformEngine\n            status\n            homePage\n            id\n        }\n    }\n"): (typeof documents)["\n    query GetContestList($pageNum: Int!, $rule: MahjongType) {\n        allContestsByRule(rule: $rule, pageNum: $pageNum) {\n            name\n            isIndividual\n            homePage\n            platformEngine\n            status\n            homePage\n            id\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query InviteCodeQuery($contestId: ID!, $inviteCode: String!) {\n        contestById(id: $contestId) {\n            checkInviteCode(inviteCode: $inviteCode)\n        }\n    }\n"): (typeof documents)["\n    query InviteCodeQuery($contestId: ID!, $inviteCode: String!) {\n        contestById(id: $contestId) {\n            checkInviteCode(inviteCode: $inviteCode)\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query TeamNameExistQuery($contestId: ID!, $name: String!) {\n        contestById(id: $contestId) {\n            checkTeamNameExist(name: $name)\n        }\n    }\n"): (typeof documents)["\n    query TeamNameExistQuery($contestId: ID!, $name: String!) {\n        contestById(id: $contestId) {\n            checkTeamNameExist(name: $name)\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation SaveTeam($payload: TeamRegistrationPayload!, $inviteCode: String!) {\n        registerNewTeam(registrationPayload: $payload, inviteCode: $inviteCode) {\n            authorizationCode\n            error {\n                ... on TeamNameAlreadyExistError {\n                    msg\n                }\n                ... on InviteCodeNotMatchError {\n                    msg\n                }\n                ... on MaxTeamMemberExceededError{\n                    msg\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation SaveTeam($payload: TeamRegistrationPayload!, $inviteCode: String!) {\n        registerNewTeam(registrationPayload: $payload, inviteCode: $inviteCode) {\n            authorizationCode\n            error {\n                ... on TeamNameAlreadyExistError {\n                    msg\n                }\n                ... on InviteCodeNotMatchError {\n                    msg\n                }\n                ... on MaxTeamMemberExceededError{\n                    msg\n                }\n            }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query GetComContestNumQuery {\n        comContestNum\n    }\n"): (typeof documents)["\n    query GetComContestNumQuery {\n        comContestNum\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query GetRiichiContestNumQuery {\n        riichiContestNum\n    }\n"): (typeof documents)["\n    query GetRiichiContestNumQuery {\n        riichiContestNum\n    }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;