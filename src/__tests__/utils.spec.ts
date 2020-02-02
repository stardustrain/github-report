import {
  getFilteredPullrequest,
  getLineCount,
  getProjectsGroupbyRepository,
  getPersonalProjects,
  getCommitsCount,
  generatePRInformation,
  getContributionByRepository,
  calculateContributionRatio,
} from '../utils'
import dummy from './dummy'

describe('utils.ts', () => {
  const filterdPullrequest = getFilteredPullrequest(dummy.nodes)

  describe('getPullrequestCount(nodes: ResultNode[])', () => {
    test('should return array of object only PullRequest type.', () => {
      expect(filterdPullrequest.length).toEqual(32)
    })
  })

  describe('getLineCount(prNodes: PullrequestNode[])', () => {
    test('should retun total additions, deletions counts.', () => {
      expect(getLineCount(dummy.nodes)).toEqual({
        additions: 6986,
        deletions: 2688,
      })
    })
  })

  describe('getProjectsGroupbyRepository(prNodes: PullrequestNode[])', () => {
    test('should return groupped object by repository name.', () => {
      const t = getProjectsGroupbyRepository(filterdPullrequest)

      expect(t).toHaveProperty('odc-frontend')
      expect(Object.keys(t).length).toEqual(6)
      expect(t['lucas-wiki']).toEqual([
        {
          __typename: 'PullRequest',
          additions: 176,
          author: { login: 'stardustrain' },
          closed: true,
          commits: { totalCount: 4 },
          createdAt: '2020-01-01T09:26:13Z',
          deletions: 12,
          repository: { name: 'lucas-wiki', owner: { login: 'stardustrain' } },
          state: 'MERGED',
          title: 'Add 2019 memoir',
        },
        {
          __typename: 'PullRequest',
          additions: 6,
          author: { login: 'stardustrain' },
          closed: true,
          commits: { totalCount: 1 },
          createdAt: '2019-12-31T07:03:59Z',
          deletions: 6,
          repository: { name: 'lucas-wiki', owner: { login: 'stardustrain' } },
          state: 'MERGED',
          title: 'github actions test.',
        },
      ])
    })
  })

  describe('getPersonalProjects(prNodes: PullrequestNode[])', () => {
    test('should return array of object that only personal project repository.', () => {
      expect(getPersonalProjects(filterdPullrequest).length).toEqual(2)
    })
  })

  describe('getCommitsCount(prNodes: PullrequestNode[])', () => {
    test('should return all of commit count.', () => {
      expect(getCommitsCount(filterdPullrequest)).toEqual(99)
    })
  })

  describe('generatePRInformation(prNodes: PullrequestNode[])', () => {
    test('should return information object from pull request nodes.', () => {
      expect(generatePRInformation(filterdPullrequest)).toEqual({
        lines: {
          additions: 6986,
          deletions: 2688,
        },
        commits: 99,
        totalPRCount: 32,
      })
    })
  })

  describe('getContributionByRepository(projects: GroupedProject, criteria: commits | totalPRCount)', () => {
    test('should return array of [PROJECT_NAME, PR_INFORMAION] sorted by criteria.', () => {
      expect(getContributionByRepository(getProjectsGroupbyRepository(filterdPullrequest))).toEqual([
        ['odc-frontend', { commits: 75, lines: { additions: 5885, deletions: 2498 }, totalPRCount: 19 }],
        ['odx-player', { commits: 10, lines: { additions: 162, deletions: 115 }, totalPRCount: 6 }],
        ['odx-admin-front', { commits: 7, lines: { additions: 661, deletions: 52 }, totalPRCount: 3 }],
        ['lucas-wiki', { commits: 5, lines: { additions: 182, deletions: 18 }, totalPRCount: 2 }],
        ['fe-assignment-lab', { commits: 1, lines: { additions: 91, deletions: 4 }, totalPRCount: 1 }],
        ['odk-frontend-homework', { commits: 1, lines: { additions: 5, deletions: 1 }, totalPRCount: 1 }],
      ])

      expect(getContributionByRepository(getProjectsGroupbyRepository(filterdPullrequest), 'commits')).toEqual([
        ['odc-frontend', { commits: 75, lines: { additions: 5885, deletions: 2498 }, totalPRCount: 19 }],
        ['odx-player', { commits: 10, lines: { additions: 162, deletions: 115 }, totalPRCount: 6 }],
        ['odx-admin-front', { commits: 7, lines: { additions: 661, deletions: 52 }, totalPRCount: 3 }],
        ['lucas-wiki', { commits: 5, lines: { additions: 182, deletions: 18 }, totalPRCount: 2 }],
        ['fe-assignment-lab', { commits: 1, lines: { additions: 91, deletions: 4 }, totalPRCount: 1 }],
        ['odk-frontend-homework', { commits: 1, lines: { additions: 5, deletions: 1 }, totalPRCount: 1 }],
      ])
    })
  })

  describe('calculateContributionRatio(data: ContributionByRepository, totalPRCount: number)', () => {
    test('should return ', () => {
      expect(
        calculateContributionRatio(getContributionByRepository(getProjectsGroupbyRepository(filterdPullrequest)), 32)
      ).toEqual([
        ['odc-frontend', { commits: 75, lines: { additions: 5885, deletions: 2498 }, totalPRCount: 19, ratio: 0.59 }],
        ['odx-player', { commits: 10, lines: { additions: 162, deletions: 115 }, totalPRCount: 6, ratio: 0.19 }],
        ['odx-admin-front', { commits: 7, lines: { additions: 661, deletions: 52 }, totalPRCount: 3, ratio: 0.09 }],
        ['lucas-wiki', { commits: 5, lines: { additions: 182, deletions: 18 }, totalPRCount: 2, ratio: 0.06 }],
        ['fe-assignment-lab', { commits: 1, lines: { additions: 91, deletions: 4 }, totalPRCount: 1, ratio: 0.03 }],
        ['odk-frontend-homework', { commits: 1, lines: { additions: 5, deletions: 1 }, totalPRCount: 1, ratio: 0.03 }],
      ])
    })
  })
})
