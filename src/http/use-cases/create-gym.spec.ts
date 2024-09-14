import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Ironberg',
      description: null,
      phone: null,
      latitude: -25.3995694,
      longitude: -51.4732985,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
