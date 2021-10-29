import { compose, isNil, isEmpty } from 'ramda'
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

const generateMessageBlock = async () => {
  const res = await getWeeklyData()
  if (isNil(res) || isEmpty(res)) {
    throw Error('Does not exist github data.')
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
}

const sendGithubWeeklyReportWebhook = async () => {
  const url = process.env.HOOK_URL ?? ''
  const isDryRun = Boolean(process.env.DRY_RUN ?? false)

  try {
    if (isEmpty(url)) {
      throw Error('Does not provide slack hook url.')
    }

    const webhook = new IncomingWebhook(url)
    const messageBlock = await generateMessageBlock()

    if (isNil(messageBlock)) {
      throw Error('Occured error when generating message block.')
    }
    if (!isDryRun) {
      await webhook.send(messageBlock)
    }
    console.info(JSON.stringify(messageBlock))
  } catch (e) {
    console.error(e)
  }
}

sendGithubWeeklyReportWebhook()
