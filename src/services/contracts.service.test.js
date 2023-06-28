const contractsService = require('./contracts.service')

describe('Contracts Service Test', () => {
  describe('Get Contracts', () => {
    test('should return all non-terminated jobs', async () => {
      const contracts = await contractsService.getContracts(1)

      expect(contracts).toHaveLength(1)

      // only non-terminated contracts should be returned
      const terminatedFound = contracts.some(c => c.status === 'terminated')
      expect(terminatedFound).toBe(false)
    })

    test('should throw when profile id is missing', async () => {
      await expect(contractsService.getContracts()).rejects.toThrow('The profile id is required')
    })
  })

  describe('Get Contract By Id', () => {
    test('should return a contract by id', async () => {
      const clientId = 1
      const contractId = 2
      const contract = await contractsService.getContractById(contractId, clientId)

      expect(contract).toEqual(expect.objectContaining({ id: 2 }))
    })

    test('should return a terminated contract by id', async () => {
      const clientId = 1
      const contractId = 1
      const contract = await contractsService.getContractById(contractId, clientId)

      expect(contract).toEqual(expect.objectContaining({ status: 'terminated' }))
    })

    test('should throw when contract id is missing', async () => {
      await expect(contractsService.getContractById()).rejects.toThrow('The contract id is required')
    })

    test('should throw when profile id is missing', async () => {
      await expect(contractsService.getContractById(1)).rejects.toThrow('The profile id is required')
    })
  })
})
