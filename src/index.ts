import axios from 'axios'
import { compose, isNil } from 'ramda'
import { IncomingWebhook } from '@slack/webhook'

import {
  getFilteredPullrequest,
  generatePRInformation,
  getPersonalProjects,
  getProjectsGroupbyRepository,
  getContributionByRepository,
  calculateContributionRatio,
  getToday,
} from './utils'
import { generateTotalInfoMessage, generatePersonalProjectMessage, generateContributionMessage } from './messages'
import { weeklyMessageBlock } from './messageBlock'

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

const getWeeklyData = async () => {
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

const generateData = async () => {
  try {
    const res = await getWeeklyData()
    if (isNil(res)) {
      throw Error()
    }

    const { from, to, nodes } = res

    const total = generatePRInformation(nodes)
    const personal = compose(generatePRInformation, getPersonalProjects)(nodes)
    const contribution = compose(getContributionByRepository, getProjectsGroupbyRepository)(nodes)
    const ratio = calculateContributionRatio(contribution, total.totalPRCount)
    return weeklyMessageBlock({
      from,
      to,
      total: generateTotalInfoMessage(total),
      personalProject: generatePersonalProjectMessage(personal),
      contributions: generateContributionMessage(ratio),
    })
  } catch (e) {
    console.error(e)
  }
}

export const sendGithubWeeklyReportWebhook = async () => {
  const url = process.env.HOOK_URL

  if (isNil(url)) {
    throw Error()
  }

  const webhook = new IncomingWebhook(url)
  const messageBlock = await generateData()

  if (isNil(messageBlock)) {
    throw Error()
  }

  try {
    await webhook.send(messageBlock)
    console.info(JSON.stringify(messageBlock))
  } catch (e) {
    console.error(e)
  }
}
