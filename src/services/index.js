const contractsService = require('./contracts.service')
const jobsService = require('./jobs.service')
const balanceService = require('./balance.service')
const profilesService = require('./profiles.service')
const adminService = require('./admin.service')

module.exports = {
  adminService,
  balanceService,
  contractsService,
  jobsService,
  profilesService,
}
