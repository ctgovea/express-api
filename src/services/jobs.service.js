const { Op } = require('sequelize')
const { sequelize } = require('../model')

async function getJobById (jobId, clientId) {
  const { Job, Contract } = sequelize.models

  const job = await Job.findOne({
    where: { id: jobId },
    include: [
      {
        model: Contract,
        where: { ClientId: clientId }
      }
    ]
  })

  return job
}

/**
 * gets list of unpaid jobs
 */
async function getUnpaidJobs (profileId) {
  const { Job, Contract } = sequelize.models

  const unpaid = await Job.findAll({
    where: {
      [Op.or]: [{ paid: null }, { paid: 0 }]
    },
    include: [
      {
        model: Contract,
        where: {
          [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
          status: 'in_progress',
        }
      }
    ]
  })
  return unpaid
}

module.exports = {
  getJobById,
  getUnpaidJobs,
}
