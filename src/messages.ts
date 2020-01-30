import { take, head, tail } from 'ramda'
import { getTotalPRCountEmogi, getPersonalProjectPRCountEmogi } from './messageUtils'

import { PRInformation, Contributions, ContributionRatio } from './utils'

export const generateTotalInfoMessage = ({ lines, commits, totalPRCount }: PRInformation) => {
  const emogi = getTotalPRCountEmogi(totalPRCount)
  return `:github: 전체통계 :merge: ${totalPRCount} ${emogi}\n ${commits} commit, ${lines.additions} lines added, ${lines.deletions} lines deleted.`
}

export const generatePersonalProjectMessage = ({ lines, commits, totalPRCount }: PRInformation) => {
  const emogi = getPersonalProjectPRCountEmogi(totalPRCount)
  return `:github: 전체통계 :merge: ${totalPRCount} ${emogi}\n ${commits} commit, ${lines.additions} lines added, ${lines.deletions} lines deleted.`
}

const generateRatioMessage = (contribution: ContributionRatio) => {

}

export const generateContributionMessage = (contributions: Contributions) => {
  const topContributions = take(5, contributions)
  head(topContributions)
  tail(topContributions)
}
