const { profilesService, jobsService } = require('.')

describe('Jobs Service Test', () => {
  describe('get job by id', () => {
    test('should return a job by id', async () => {
      const job = await jobsService.getJobById(5, 4)

      expect(job).toMatchObject({
        id: 5,
        price: 200,
        paid: null,
        ContractId: 7,
      })
    })

    test('should throw when job id is missing', async () => {
      await expect(jobsService.getJobById()).rejects.toThrow('The job id is required')
    })
  
    test('should throw when client id is missing', async () => {
      await expect(jobsService.getJobById(1)).rejects.toThrow('The client id is required')
    })
  })

  describe('get unpaid jobs', () => {
    test('should return unpaid jobs', async () => {
      const unpaid = await jobsService.getUnpaidJobs(2)

      expect(unpaid).toHaveLength(2)
      const paid = unpaid.some(j => j.paid === true)
      expect(paid).toBe(false)
    })

    test('should throw when profile id is missing', async () => {
      await expect(jobsService.getUnpaidJobs()).rejects.toThrow('The profile id is required')
    })
  }) 

  describe('pay a job', () => {
    test('should transact balance from client to contractor', async () => {
      const clientId = 1
      const client = await profilesService.getProfileClient(clientId)
      const balanceClient = client.balance
      
      const contractorId = 5
      const contractor = await profilesService.getProfileContractor(contractorId)
      const balanceContractor = contractor.balance

      await jobsService.payJob(1, clientId)
      
      const updatedClient = await profilesService.getProfileClient(clientId)
      const updatedContractor = await profilesService.getProfileContractor(contractorId)
      
      expect(updatedClient.balance).toBe(balanceClient - 200)
      expect(updatedContractor.balance).toBe(balanceContractor + 200)

    })

    test('should throw when a balance is not enough', async () => {
      await expect(jobsService.payJob(5, 4)).rejects.toThrow('Not enough balance to pay the job')
    })

    test('should throw when a job is not found', async () => {
      await expect(jobsService.payJob(99, 1)).rejects.toThrow('Job not found')
    })

    test('should throw when a contractor tries to pay', async () => {
      await expect(jobsService.payJob(1,8)).rejects.toThrow('You need to be a client to pay a job')
    })

    test('should throw when job id is missing', async () => {
      await expect(jobsService.payJob()).rejects.toThrow('The job id is required')
    })

    test('should throw when client id is missing', async () => {
      await expect(jobsService.payJob(1)).rejects.toThrow('The client id is required')
    })
  }) 

})
