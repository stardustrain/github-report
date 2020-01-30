export const weeklyMessageBlock = ({
  from,
  to,
  total,
  personalProject,
  contribution,
}: WeeklyMessageBlockParams) => ({
  text: 'Github report of a last week!',
  blocks: [{
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `:calendar: *${from}* ~ *${to}* Github report`,
    },
  }, {
    type: 'divider',
  }, {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: total,
    },
  }, {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: personalProject,
    },
  }, {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: contribution,
    },
  }, {
    type: 'divider',
  }, {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `Rescuetime :point_right: <https://www.rescuetime.com/dashboard/for/the/week/of/${from}|Dashboard>`,
    },
  }],
})
