import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-1',
      title: 'Ironberg',
      description: '',
      phone: '',
      latitude: -25.3995694,
      longitude: -51.4732985,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -25.3995694,
      userLongitude: -51.4732985,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 8, 13, 20, 25, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -25.3995694,
      userLongitude: -51.4732985,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-1',
        userLatitude: -25.3995694,
        userLongitude: -51.4732985,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 8, 13, 20, 25, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -25.3995694,
      userLongitude: -51.4732985,
    })

    vi.setSystemTime(new Date(2024, 8, 14, 20, 25, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -25.3995694,
      userLongitude: -51.4732985,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-2',
      title: 'Ironberg',
      description: '',
      phone: '',
      latitude: -25.3481003,
      longitude: -51.4733236,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-2',
        userLatitude: -25.3995694,
        userLongitude: -51.4732985,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
