const { Router } = require('express')
const { Op } = require('sequelize')
const { getProfile } = require('../middleware/getProfile')

const router = Router()

/**
 * @returns all active contracts from a contractor or client
 */
router.get('/', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models')
  const { profile } = req
  const contracts = await Contract.findAll({
    where: {
      [Op.or]: [{ ContractorId: profile.id }, { ClientId: profile.id }],
      status: { [Op.ne]: 'terminated' }
    }
  })
  if (!contracts) return res.status(404).end()
  res.json(contracts)
})

/**
 * @returns contract by id
 */
router.get('/:id', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models')
  const { profile } = req
  const { id } = req.params
  const contract = await Contract.findOne({
    where: {
      [Op.and]: [{ id }],
      [Op.or]: [{ ContractorId: profile.id }, { ClientId: profile.id }]
    }
  })
  if (!contract) return res.status(404).end()
  res.json(contract)
})

module.exports = router
