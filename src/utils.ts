import { groupBy, keys, map, pipe, sortBy, prop, negate } from 'ramda'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const REPOSITORY_NAME = 0
const PR_INFORMATION_INDEX = 1

export const getToday = () =>
  dayjs()
    .utc()
    .utcOffset(9)

export const getFilteredPullrequest = (nodes: ResultNode[]) =>
  nodes.filter(prNode => prNode.__typename === 'PullRequest') as PullrequestNode[]

export const getLineCount = (prNodes: PullrequestNode[]) =>
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

export const getCommitsCount = (prNodes: PullrequestNode[]) =>
  prNodes.reduce((acc, prNode) => acc + (prNode?.commits?.totalCount ?? 0), 0)

export const getPersonalProjects = (prNodes: PullrequestNode[]) =>
  prNodes.filter(prNode => prNode.repository.owner.login === 'stardustrain')

export const getProjectsGroupbyRepository = (prNodes: PullrequestNode[]) =>
  groupBy(node => node.repository.name, prNodes)

export const generatePRInformation = (prNodes: PullrequestNode[]) => ({
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
    map<string, [string, PRInformation]>(key => [key, generatePRInformation(projects[key])]),
    sortBy(v => negate(prop(criteria)(v[PR_INFORMATION_INDEX])))
  )(projects)

export const calculateContributionRatio = (contributions: ContributionByRepository, totalPRCount: number) =>
  contributions.map<[string, ContributionRatio]>(contribution => [
    contribution[REPOSITORY_NAME],
    {
      ...contribution[PR_INFORMATION_INDEX],
      ratio: parseFloat((contribution[PR_INFORMATION_INDEX].totalPRCount / totalPRCount).toFixed(2)),
    },
  ])

type GroupedProject = ReturnType<typeof getProjectsGroupbyRepository>
type ContributionByRepository = ReturnType<typeof getContributionByRepository>
export type ContributionRatio = PRInformation & { ratio: number }
export type PRInformation = ReturnType<typeof generatePRInformation>
export type Contributions = ReturnType<typeof calculateContributionRatio>
