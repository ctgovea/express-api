const { Router } = require('express')
const { getProfile } = require('../middleware/getProfile')
const { balanceService } = require('../services/')

const router = Router()

/**
 * Adds a balance to a client profile
 */
router.post('/deposit/:userId', getProfile, async (req, res) => {
  const { userId } = req.params
  const { amount } = req.body

  try {
    await balanceService.addBalance(userId, amount)
  } catch (error) {
    return res.status(400).end(error.message)
  }

  res.status(200).end()
})

module.exports = router
