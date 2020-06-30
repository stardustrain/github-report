import { compose, omit, map } from 'ramda'
import { getDailyData } from './api'
import { create } from './firestore'

const getGeneratedGithubData = (nodes: PullrequestNode[]) =>
  compose(
    map(node => ({
      ...node,
      author: node.author.login,
      commits: node.commits.totalCount,
      repository: {
        name: node.repository.name,
        owner: node.repository.owner.login,
      },
    })),
    map<PullrequestNode, Omit<PullrequestNode, '__typename'>>(
      omit<'__typename'>(['__typename'])
    )
  )(nodes)
export type GeneratedGithubData = ReturnType<typeof getGeneratedGithubData>

const updateDailyData = async () => {
  try {
    const { nodes, date } = await getDailyData()
    const data = getGeneratedGithubData(nodes)

    await create(data, date)
  } catch (e) {
    console.error(e)
  }
}

updateDailyData()
