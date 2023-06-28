const { Router } = require('express')
const { getProfile } = require('../middleware/getProfile')
const { contractsService } = require('../services/')

const router = Router()

/**
 * @returns all active contracts from a contractor or client
 */
router.get('/', getProfile, async (req, res) => {
  const { profile } = req
  try {
    const contracts = await contractsService.getContracts(profile.id)
    if (!contracts) return res.status(404).end()
    res.json(contracts)
  } catch (error) {
    return res.status(400).end(error.message)
  }
})

/**
 * @returns contract by id
 */
router.get('/:id', getProfile, async (req, res) => {
  const { profile } = req
  const { id } = req.params
  try {
    const contract = await contractsService.getContractById(id, profile.id)
    if (!contract) return res.status(404).end()
    res.json(contract)
  } catch (error) {
    return res.status(400).end(error.message)
  }
})

module.exports = router
