const { Op } = require('sequelize')
const { sequelize } = require('../model')

/*
* @returns a contract by id
*/
async function getContractById (contractId, profileId) {
  if (!contractId) throw new Error('The contract id is required')
  if (!profileId) throw new Error('The profile id is required')

  const { Contract } = sequelize.models

  const contract = await Contract.findOne({
    where: {
      [Op.and]: [{ id: contractId }],
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }]
    }
  })

  return contract
}

/*
* @returns active contracts
*/
async function getContracts (profileId) {
  if (!profileId) throw new Error('The profile id is required')

  const { Contract } = sequelize.models

  const contracts = await Contract.findAll({
    where: {
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      status: { [Op.ne]: 'terminated' }
    }
  })
  return contracts
}

module.exports = {
  getContractById,
  getContracts,
}
