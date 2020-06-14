import axios from 'axios'

import { getFilteredPullrequest, getToday } from './utils'

const instance = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.GITHUB_API_KEY}`,
  },
})

const query = (from: string, to: string) => `
  query {
    search(query: "author:stardustrain created:${from}..${to}", type: ISSUE, first:100) {
      issueCount
      nodes {
        __typename
        ... on PullRequest {
          createdAt
          closed
          title
          additions
          deletions
          state
          author {
            login
          }
          commits {
            totalCount
          }
          repository {
            name
            owner {
              login
            }
          }
        }
      }
    }
  }
`

export const getDailyData = async () => {
  try {
  } catch (e) {
    console.error(e)
  }
}

export const getWeeklyData = async () => {
  try {
    const today = getToday()
    const from = today.subtract(6, 'day').format('YYYY-MM-DD')
    const to = today.subtract(1, 'day').format('YYYY-MM-DD')
    const {
      data: {
        data: {
          search: { nodes },
        },
      },
    } = await instance.post<GithubResponse>('', {
      query: query(from, to),
    })
    return {
      nodes: getFilteredPullrequest(nodes),
      from,
      to,
    }
  } catch (e) {
    console.error(e)
  }
}
