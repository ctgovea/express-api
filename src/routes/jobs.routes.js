const { Router } = require('express')
const { getProfile } = require('../middleware/getProfile')
const { jobsService } = require('../services/')

const router = Router()

/**
 * @returns all unpaid jobs for a client/contractor, active contracts only
 */
router.get('/unpaid', getProfile, async (req, res) => {
  const { profile } = req

  try {
    const unpaid = await jobsService.getUnpaidJobs(profile.id)
    if (!unpaid) return res.status(404).end()
    res.json(unpaid)
  } catch (error) {
    return res.status(400).end(error.message)
  }
})

/**
 * a client pays for a job using a transaction
 */
router.post('/:jobId/pay', getProfile, async (req, res) => {
  const { profile } = req
  const { jobId } = req.params

  try {
    await jobsService.payJob(jobId, profile.id)
  } catch (error) {
    console.log(error)
    return res.status(400).end(error.message)
  }

  res.status(200).end()
})

module.exports = router
