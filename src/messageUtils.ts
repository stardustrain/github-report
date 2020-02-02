import { cond, gte, lt, always, T } from 'ramda'

interface CriteriaParam {
  gteCriteria: number
  ltCriteria: number
}

const getPRCountEmogi = ({ gteCriteria, ltCriteria }: CriteriaParam) => (prCount: number) =>
  cond<number, string>([
    [x => gte(x, gteCriteria), always(':clap:')],
    [x => lt(x, ltCriteria), always(':weary:')],
    [T, always('')],
  ])(prCount)

export const getTotalPRCountEmogi = getPRCountEmogi({
  gteCriteria: 7,
  ltCriteria: 4,
})

export const getPersonalProjectPRCountEmogi = getPRCountEmogi({
  gteCriteria: 3,
  ltCriteria: 1,
})
