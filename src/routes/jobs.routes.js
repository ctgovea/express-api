const { Router } = require('express')
const { Op } = require('sequelize')
const { getProfile } = require('../middleware/getProfile')

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

module.exports = router
