import { getTotalPRCountEmogi, getPersonalProjectPRCountEmogi } from '../messageUtils'

describe('messageUtils.ts', () => {
  describe('getTotalPRCountEmogi(prCount: number)', () => {
    test('should return :clap: when prCount gte 7.', () => {
      expect(getTotalPRCountEmogi(6)).not.toEqual(':clap:')
      expect(getTotalPRCountEmogi(7)).toEqual(':clap:')
      expect(getTotalPRCountEmogi(8)).toEqual(':clap:')
    })

    test('should return :weary: when prCount lt 4.', () => {
      expect(getTotalPRCountEmogi(3)).toEqual(':weary:')
      expect(getTotalPRCountEmogi(4)).not.toEqual(':weary:')
      expect(getTotalPRCountEmogi(5)).not.toEqual(':weary:')
    })

    test('should return empty string when prCount lt 7 gte 4.', () => {
      expect(getTotalPRCountEmogi(3)).toEqual(':weary:')
      expect(getTotalPRCountEmogi(4)).toEqual('')
      expect(getTotalPRCountEmogi(5)).toEqual('')
      expect(getTotalPRCountEmogi(6)).toEqual('')
      expect(getTotalPRCountEmogi(7)).not.toEqual('')
    })
  })

  describe('getPersonalProjectPRCountEmogi(prCount: number)', () => {
    test('should return :clap: when prCount gte 3.', () => {
      expect(getPersonalProjectPRCountEmogi(2)).not.toEqual(':clap:')
      expect(getPersonalProjectPRCountEmogi(3)).toEqual(':clap:')
      expect(getPersonalProjectPRCountEmogi(4)).toEqual(':clap:')
    })
    test('should return :weary: when prCount lt 1.', () => {
      expect(getPersonalProjectPRCountEmogi(0)).toEqual(':weary:')
      expect(getPersonalProjectPRCountEmogi(1)).not.toEqual(':weary:')
      expect(getPersonalProjectPRCountEmogi(2)).not.toEqual(':weary:')
    })
    test('should return empty string when prCount lt 3 gte 1.', () => {
      expect(getPersonalProjectPRCountEmogi(0)).toEqual(':weary:')
      expect(getPersonalProjectPRCountEmogi(1)).toEqual('')
      expect(getPersonalProjectPRCountEmogi(2)).toEqual('')
      expect(getPersonalProjectPRCountEmogi(3)).not.toEqual('')
    })
  })
})
