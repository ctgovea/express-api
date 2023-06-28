const { sequelize } = require('../model')

async function getProfileClient (clientId) {
  if (!clientId) throw new Error('The client id is required')

  const { Profile } = sequelize.models

  const clientProfile = await Profile.findOne({ where: { id: clientId, type: 'client' } })

  return clientProfile
}

module.exports = {
  getProfileClient,
}
