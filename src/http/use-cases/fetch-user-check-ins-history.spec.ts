import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchUserCheckInHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInHistoryUseCase

describe('Fetch User Check-in History Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInHistoryUseCase(checkInsRepository)
  })

  it('should be able to fetch check-in history', async () => {
    await checkInsRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-1',
    })

    await checkInsRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-2',
    })

    const { checkIns } = await sut.execute({
      userId: 'user-1',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-1' }),
      expect.objectContaining({ gym_id: 'gym-2' }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        user_id: 'user-1',
        gym_id: `gym-${i}`,
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-1',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
