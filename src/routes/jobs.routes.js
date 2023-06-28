const { Router } = require('express')
const { Op } = require('sequelize')
const { getProfile } = require('../middleware/getProfile')
const { sequelize } = require('../model')

const router = Router()

/**
 * @returns all unpaid jobs for a client/contractor, active contracts only
 */
router.get('/unpaid', getProfile, async (req, res) => {
  const { profile } = req
  const { Contract, Job } = req.app.get('models')

  const unpaid = await Job.findAll({
    where: {
      [Op.or]: [{ paid: null }, { paid: 0 }]
    },
    include: [
      {
        model: Contract,
        where: {
          [Op.or]: [{ ContractorId: profile.id }, { ClientId: profile.id }],
          status: 'in_progress',
        }
      }
    ]
  })
  if (!unpaid) return res.status(404).end()
  res.json(unpaid)
})

/**
 * a client pays for a job using a transaction
 */
router.post('/:jobId/pay', getProfile, async (req, res) => {
  const { Job, Profile, Contract } = req.app.get('models')
  const { profile } = req
  const { jobId } = req.params
  const client = await Profile.findOne({ where: { id: profile.id, type: 'client' } })

  // Only clients can pay!
  if (!client) return res.status(400).end('You need to be a client to pay a job')

  const job = await Job.findOne({
    where: { id: jobId },
    include: [
      {
        model: Contract,
        where: { ClientId: profile.id }
      }
    ]
  })

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
      await Job.update({ paid: true }, { where: { id: job.id }, transaction: t })

      return true
    })
    return res.json(success)
  } catch (error) {
    // the transaction is rolled back automatically
    return res.status(500).end()
  }
})

module.exports = router
