import type { TotalInformation, PersonalProjectInformation, ContributionsInformation } from './messages'

interface MessageParams {
  from: string
  to: string
  total: TotalInformation
  personalProject: PersonalProjectInformation
  contributions: ContributionsInformation
}

export const weeklyMessageBlock = ({ from, to, total, personalProject, contributions }: MessageParams) => ({
  text: 'Github report of a last week!',
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:calendar: *${from}* ~ *${to}* Github report`,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: total,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: personalProject,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: contributions,
      },
    },
  ],
})
