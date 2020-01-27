interface Author {
  login: string
}

interface Commit {
  totalCount: number
}

interface Repository {
  owner: Author
  name: string
}

interface ResultNode {
  __typename: 'PullRequest' | 'Issue'
  createdAt: string
  closed: boolean
  title: string
  additions: number
  deletions: number
  state: 'OPEN' | 'MERGED' | 'CLOSED'
  author: Author
  commits: Commit
  repository: Repository
}

interface GithubResponse {
  data: {
    search: {
      issueCount: number
      nodes: ResultNode[]
    }
  }
}

type PullrequestNode = Omit<ResultNode, '__typename'> & {
  __typename: 'PullRequest'
}
