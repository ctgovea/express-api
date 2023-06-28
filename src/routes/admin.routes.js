const { Router } = require('express')
const { getProfile } = require('../middleware/getProfile')
const { adminService } = require('../services/')

const router = Router()

router.get('/best-profession', getProfile, async (req, res) => {
  const { start, end } = req.query

  try {
    const bestProfession = await adminService.getBestProfession(start, end)
    return res.json(bestProfession)
  } catch (error) {
    return res.status(400).end(error.message)
  }
})

router.get('/best-clients', getProfile, async (req, res) => {
  const { start, end, limit } = req.query

  try {
    const bestClients = await adminService.getBestClients(start, end, limit)
    return res.json(bestClients)
  } catch (error) {
    return res.status(400).end(error.message)
  }
})

module.exports = router
