import { groupBy, keys, map, pipe, sortBy, prop, negate, isNil } from 'ramda'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import type { SearchResultFragment, PullrequestNodeFragment } from './@types/model'

dayjs.extend(utc)

export const REPOSITORY_NAME = 0
export const PR_INFORMATION = 1

export const getToday = () => dayjs().utc().utcOffset(9)

export const getFilteredPullrequest = (nodes: SearchResultFragment['nodes']) =>
  (nodes ?? []).flatMap((node) => (isNil(node) || node.__typename !== 'PullRequest' ? [] : [node]))

export const getLineCount = (prNodes: PullrequestNodeFragment[]) =>
  prNodes.reduce(
    (acc, prNode) => ({
      additions: acc.additions + (prNode.additions ?? 0),
      deletions: acc.deletions + (prNode.deletions ?? 0),
    }),
    {
      additions: 0,
      deletions: 0,
    }
  )

export const getCommitsCount = (prNodes: PullrequestNodeFragment[]) =>
  prNodes.reduce((acc, prNode) => acc + (prNode?.commits?.totalCount ?? 0), 0)

export const getPersonalProjects = (prNodes: PullrequestNodeFragment[]) =>
  prNodes.filter((prNode) => prNode.repository.owner.login === 'stardustrain')

export const getProjectsGroupbyRepository = (prNodes: PullrequestNodeFragment[]) =>
  groupBy((node) => node.repository.name, prNodes)

export const generatePRInformation = (prNodes: PullrequestNodeFragment[]) => ({
  lines: getLineCount(prNodes),
  commits: getCommitsCount(prNodes),
  totalPRCount: prNodes.length,
})

export const getContributionByRepository = (
  projects: GroupedProject,
  criteria: 'commits' | 'totalPRCount' = 'totalPRCount'
) =>
  pipe(
    keys,
    map<string, [string, PRInformation]>((key) => [key, generatePRInformation(projects[key])]),
    sortBy((v) => negate(prop(criteria)(v[PR_INFORMATION])))
  )(projects)

export const calculateContributionRatio = (contributions: ContributionByRepository, totalPRCount: number) =>
  contributions.map<[string, ContributionRatio]>((contribution) => [
    contribution[REPOSITORY_NAME],
    {
      ...contribution[PR_INFORMATION],
      ratio: parseFloat((contribution[PR_INFORMATION].totalPRCount / totalPRCount).toFixed(2)),
    },
  ])

type GroupedProject = ReturnType<typeof getProjectsGroupbyRepository>
type ContributionByRepository = ReturnType<typeof getContributionByRepository>
export type ContributionRatio = PRInformation & { ratio: number }
export type PRInformation = ReturnType<typeof generatePRInformation>
export type Contributions = ReturnType<typeof calculateContributionRatio>
