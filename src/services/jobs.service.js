const { Op } = require('sequelize')
const { sequelize } = require('../model')
const profileService = require('./profiles.service')

async function getJobById (jobId, clientId) {
  if (!jobId) throw new Error('The job id is required')
  if (!clientId) throw new Error('The client id is required')

  const { Job, Contract } = sequelize.models

  const job = await Job.findOne({
    where: { id: jobId },
    include: [
      {
        model: Contract,
        where: { ClientId: clientId }
      }
    ]
  })

  return job
}

/**
 * gets list of unpaid jobs
 */
async function getUnpaidJobs (profileId) {
  if (!profileId) throw new Error('The profile id is required')

  const { Job, Contract } = sequelize.models

  const unpaid = await Job.findAll({
    where: {
      [Op.or]: [{ paid: null }, { paid: 0 }]
    },
    include: [
      {
        model: Contract,
        where: {
          [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
          status: 'in_progress',
        }
      }
    ]
  })
  return unpaid
}

/**
 * gets the total amount owned
 */
async function getTotalOwned (profileId) {
  const unpaidJobs = await getUnpaidJobs(profileId)
  const total = unpaidJobs.reduce((total, { price }) => total + price, 0)

  return total
}

/**
 * a client pays for a job using a transaction
 */
async function payJob (jobId, clientId) {
  if (!jobId) throw new Error('The job id is required')
  if (!clientId) throw new Error('The client id is required')

  const { Job, Profile } = sequelize.models
  const client = await profileService.getProfileClient(clientId)

  // Only clients can pay!
  if (!client) throw new Error('You need to be a client to pay a job')

  const job = await getJobById(jobId, clientId)

  if (!job) throw new Error('Job not found')

  // The job has been paid already, nothing else to do
  if (job.paid) return true

  // Client has enough balance?
  if (job.price > client.balance) throw new Error('Not enough balance to pay the job')

  // Let's pay
  const contractorId = job.Contract.ContractorId

  // Apply balance transaction atomically
  const success = await sequelize.transaction(async (t) => {
    await Profile.decrement('balance', { by: job.price, where: { id: clientId }, transaction: t })
    await Profile.increment('balance', { by: job.price, where: { id: contractorId }, transaction: t })
    await Job.update({
      paid: true,
      paymentDate: new Date().toISOString()
    }, { where: { id: job.id }, transaction: t })

    return true
  })
  return success
}

module.exports = {
  getJobById,
  getUnpaidJobs,
  getTotalOwned,
  payJob,
}
