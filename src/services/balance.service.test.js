const balanceService = require('./balance.service')
const profileService = require('./profiles.service')

describe('Balance Service Test', () => {
  describe('Add Balance', () => {
    test('should not deposit more than 25% of total jobs to pay', async () => {
      await expect(balanceService.addBalance(1, 110)).rejects.toThrow('Whoa that seems to be too much. Try with a smaller amount')
    })

    test('should deposit money into a balance', async () => {
      const { balance } = await profileService.getProfileClient(1)
      await balanceService.addBalance(1, 50)
      const updated = await profileService.getProfileClient(1)
      expect(updated.balance).toBe(balance + 50)
    })

    test('should deposit money into a balance when nothing is owed', async () => {
      const clientId = 3
      const { balance } = await profileService.getProfileClient(clientId)
      await balanceService.addBalance(clientId, 50)
      const updated = await profileService.getProfileClient(clientId)
      expect(updated.balance).toBe(balance + 50)
    })

    test('should throw when contractor id is passed', async () => {
      const contractorId = 8
      await expect(balanceService.addBalance(contractorId, 15)).rejects.toThrow('You need to be a client to deposit')
    })

    test('should throw when profile id is missing', async () => {
      await expect(balanceService.addBalance()).rejects.toThrow('The profile id is required')
    })

    test('should throw when amount is missing', async () => {
      await expect(balanceService.addBalance(1)).rejects.toThrow('The amount is required')
    })
  })
})
