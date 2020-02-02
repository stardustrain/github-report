import { isNil, isEmpty, take, addIndex, map, pipe, join } from 'ramda'
import { getTotalPRCountEmogi, getPersonalProjectPRCountEmogi } from './messageUtils'

import { REPOSITORY_NAME, PR_INFORMATION, PRInformation, Contributions } from './utils'

type Contribution = Contributions[number]

const TAKE_MESSAGES = 5
const indexedMap = addIndex<Contribution>(map)

export const generateTotalInfoMessage = ({ lines, commits, totalPRCount }: PRInformation) => {
  const emogi = getTotalPRCountEmogi(totalPRCount)
  return `:github: 전체통계 :merge: ${totalPRCount} ${emogi}\n ${commits} commit, ${lines.additions} lines added, ${lines.deletions} lines deleted.`
}

export const generatePersonalProjectMessage = ({ lines, commits, totalPRCount }: PRInformation) => {
  const emogi = getPersonalProjectPRCountEmogi(totalPRCount)
  return `개인 프로젝트 :merge: ${totalPRCount} ${emogi}\n ${commits} commit, ${lines.additions} lines added, ${lines.deletions} lines deleted.`
}

const generateRatioMessage = (contribution: Contribution) => {
  const { totalPRCount, commits, ratio } = contribution[PR_INFORMATION]
  return `${contribution[REPOSITORY_NAME]}(${(ratio * 100).toFixed(
    0
  )}%): ${totalPRCount} pull requests / ${commits} commits.`
}

export const generateContributionMessage = (contributions: Contributions) => {
  if (isNil(contributions) || isEmpty(contributions)) {
    return 'empty data.'
  }

  if (contributions.length === 1) {
    return `1. ${generateRatioMessage(contributions[0])}`
  }

  return pipe(
    take(TAKE_MESSAGES),
    indexedMap(
      (contribution, i) => `${i + 1}. ${generateRatioMessage(contribution)}${i + 1 < TAKE_MESSAGES ? '\n' : ''}`
    ),
    join('')
  )(contributions)
}

export type TotalInformation = ReturnType<typeof generateTotalInfoMessage>
export type PersonalProjectInformation = ReturnType<typeof generatePersonalProjectMessage>
export type ContributionsInformation = ReturnType<typeof generateContributionMessage>
