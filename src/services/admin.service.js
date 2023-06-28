const { Op, fn, col } = require('sequelize')
const { sequelize } = require('../model')

async function getBestProfession (startDate, endDate) {
  if (!startDate || !endDate) throw new Error('start and end date must be provided')
  const { Job, Contract, Profile } = sequelize.models

  const mostPaidContractor = await Job.findOne({
    attributes: [[fn('sum', col('price')), 'sumPrice']],
    where: {
      paymentDate: { [Op.between]: [startDate, endDate] },
    },
    include: {
      model: Contract,
      required: true,
      attributes: ['id'],
      include: {
        model: Profile,
        association: 'Contractor',
        attributes: ['profession']
      },
    },
    group: ['Contract.ContractorId'],
    order: [[col('sumPrice'), 'DESC']]
  })
  const bestProfession = mostPaidContractor.Contract.Contractor.profession

  return bestProfession
}

async function getBestClients (startDate, endDate, limit = 2) {
  if (!startDate || !endDate) throw new Error('parameters start and end must be provided')

  const { Contract, Job, Profile } = sequelize.models

  const query = await Job.findAll({
    attributes: [
      [fn('sum', col('price')), 'sumPrice']
    ],
    where: {
      paymentDate: { [Op.between]: [startDate, endDate] },
    },
    include: {
      model: Contract,
      attributes: ['id'],
      include: {
        model: Profile,
        association: 'Client',
      },
    },
    group: ['Contract.clientId'],
    order: [[col('sumPrice'), 'DESC']],
    limit,
  })

  const bestClients = query.map(q => ({
    id: q.Contract.Client.id,
    fullName: `${q.Contract.Client.firstName} ${q.Contract.Client.lastName}`,
    paid: q.sumPrice,
  }))

  return bestClients
}

module.exports = {
  getBestClients,
  getBestProfession,
}
