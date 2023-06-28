const { Router } = require('express')
const { getProfile } = require('../middleware/getProfile')
const { sequelize } = require('../model')
const { jobsService } = require('../services/')

const router = Router()

/**
 * @returns all unpaid jobs for a client/contractor, active contracts only
 */
router.get('/unpaid', getProfile, async (req, res) => {
  const { profile } = req

  const unpaid = await jobsService.getUnpaidJobs(profile.id)

  if (!unpaid) return res.status(404).end()
  res.json(unpaid)
})

/**
 * a client pays for a job using a transaction
 */
router.post('/:jobId/pay', getProfile, async (req, res) => {
  const { Job, Profile } = req.app.get('models')
  const { profile } = req
  const { jobId } = req.params
  const client = await Profile.findOne({ where: { id: profile.id, type: 'client' } })

  // Only clients can pay!
  if (!client) return res.status(400).end('You need to be a client to pay a job')

  const job = await jobsService.getJobById(jobId, profile.id)

  if (!job) return res.status(404).end()

  // The job has been paid already, everything ok
  if (job.paid) return res.status(200).end()

  // Client has enough balance?
  if (job.price > client.balance) return res.status(400).end('Not enough balance to pay the job')

  // Let's pay
  const contractorId = job.Contract.ContractorId

  // Apply balance transaction atomically
  try {
    const success = await sequelize.transaction(async (t) => {
      await Profile.decrement('balance', { by: job.price, where: { id: profile.id }, transaction: t })
      await Profile.increment('balance', { by: job.price, where: { id: contractorId }, transaction: t })
      await Job.update({
        paid: true,
        paymentDate: new Date().toISOString(),
      }, { where: { id: job.id }, transaction: t })

      return true
    })
    return res.json(success)
  } catch (error) {
    // the transaction is rolled back automatically
    return res.status(500).end()
  }
})

module.exports = router
