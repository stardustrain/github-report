import { generateContributionMessage } from '../messages'

import { contributionsDummy } from './dummy'

describe('messages.ts', () => {
  describe('generateContributionMessage(contributions: Contributions)', () => {
    test('should return generated contribution messages.', () => {
      expect(generateContributionMessage(contributionsDummy)).toEqual(
        '*프로젝트기여 TOP 5*\n1. odc-frontend (59%): *19* pull requests | 75 commits.\n2. odx-player (19%): *6* pull requests | 10 commits.\n3. odx-admin-front (9%): *3* pull requests | 7 commits.\n4. lucas-wiki (6%): *2* pull requests | 5 commits.\n5. fe-assignment-lab (3%): *1* pull requests | 1 commits.'
      )
    })

    test('should return "empty data." when received empty or nullish argument.', () => {
      expect(generateContributionMessage([])).toEqual('empty data.')
    })
  })
})
