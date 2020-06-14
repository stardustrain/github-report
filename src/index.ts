import { compose, isNil } from 'ramda'
import { IncomingWebhook } from '@slack/webhook'

import { getWeeklyData } from './api'
import {
  generatePRInformation,
  getPersonalProjects,
  getProjectsGroupbyRepository,
  getContributionByRepository,
  calculateContributionRatio,
} from './utils'
import { generateTotalInfoMessage, generatePersonalProjectMessage, generateContributionMessage } from './messages'
import { weeklyMessageBlock } from './messageBlock'
import { updateDailyData } from './firestore'

const generateMessageBlock = async () => {
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
  const messageBlock = await generateMessageBlock()

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

updateDailyData()
