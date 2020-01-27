import axios from 'axios'

import { getFilteredPullrequest } from './utils'

const instance = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.GITHUB_API_KEY}`,
  },
})

const query = `
  query {
    search(query: "author:stardustrain created:2019-12-01..2020-01-06", type: ISSUE, first:100) {
      issueCount
      pageInfo {
        hasNextPage
        endCursor
      }
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

const getWeeklyData = async () => {
  try {
    const {
      data: {
        data: {
          search: { nodes },
        },
      },
    } = await instance.post<GithubResponse>('', {
      query,
    })

    const pullRequests = getFilteredPullrequest(nodes)
  } catch (e) {
    console.error(e)
  }
}

getWeeklyData()
