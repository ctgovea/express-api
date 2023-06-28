const jobsService = require('./jobs.service')
const profileService = require('./profiles.service')
const { sequelize } = require('../model')

/**
 * Adds a balance to a client profile
 */
async function addBalance (profileId, amount) {
  if (!profileId) throw new Error('The profile id is required')
  if (!amount) throw new Error('The amount is required')

  const { Profile } = sequelize.models
  const MAXIMUM_OWNED_PERCENT = 0.25

  const client = await profileService.getProfileClient(profileId)

  // Only clients can deposit!
  if (!client) throw new Error('You need to be a client to deposit')

  // Deposit amount must be 25% or less from pending jobs to pay
  const totalOwed = await jobsService.getTotalOwed(profileId)

  if (amount > totalOwed * MAXIMUM_OWNED_PERCENT && totalOwed > 0) {
    throw new Error('Whoa that seems to be too much. Try with a smaller amount')
  }

  await Profile.increment('balance', { by: amount, where: { id: profileId } })
}

module.exports = {
  addBalance,
}
