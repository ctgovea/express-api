const { sequelize } = require('../model')

async function getProfileClient (clientId) {
  if (!clientId) throw new Error('The client id is required')

  const { Profile } = sequelize.models

  const clientProfile = await Profile.findOne({ where: { id: clientId, type: 'client' } })

  return clientProfile
}

async function getProfileContractor (contractorId) {
  if (!contractorId) throw new Error('The contractor id is required')

  const { Profile } = sequelize.models

  const contractorProfile = await Profile.findOne({ where: { id: contractorId, type: 'contractor' } })

  return contractorProfile
}

module.exports = {
  getProfileClient,
  getProfileContractor,
}
