import { groupBy, keys, map, pipe, sortBy, prop, negate } from 'ramda'

type GroupedProject = ReturnType<typeof getProjectsGroupbyRepository>

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
    map(key => [key, generatePRInformation(projects[key])]),
    sortBy(v => negate(prop(criteria)(v[1])))
  )(projects)
