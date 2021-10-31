import axios from 'axios'
import dayjs from 'dayjs'
import gql from 'graphql-tag'
import { print } from 'graphql'

import { getFilteredPullrequest, getToday } from './utils'

import type { GithubResponseQuery } from './@types/model'

const instance = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.GH_API_KEY}`,
  },
})

const query = (from: string, to: string) =>
  print(gql`
  query GithubResponse {
    search(query: "author:stardustrain created:${from}..${to}", type: ISSUE, first:100) {
      ...SearchResult
    }
  }

  fragment SearchResult on SearchResultItemConnection {
    issueCount
    nodes {
      __typename
      ... on PullRequest {
        ...PullrequestNode
      }
    }
  }

  fragment PullrequestNode on PullRequest {
    createdAt
    closed
    title
    additions
    deletions
    state
    author {
      ...Author
    }
    commits {
      ...Commit
    }
    repository {
      ...Respository
    }
  }

  fragment Author on Actor {
    login
  }

  fragment Commit on PullRequestCommitConnection {
    totalCount
  }

  fragment Respository on Repository {
    name
    owner {
      ...Author
    }
  }
`)

export const getDailyData = async () => {
  const yesterday = dayjs().utc().subtract(1, 'day').format('YYYY-MM-DD')

  const {
    data: {
      data: {
        search: { nodes },
      },
    },
  } = await instance.post<{ data: GithubResponseQuery }>('', {
    query: query(yesterday, yesterday),
  })

  return {
    nodes: getFilteredPullrequest(nodes),
    date: yesterday,
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
    } = await instance.post<{ data: GithubResponseQuery }>('', {
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
