const { Router } = require('express')
const contractsRouter = require('./contracts.routes')
const jobsRouter = require('./jobs.routes')
const balancesRouter = require('./balances.routes')

const router = Router()

router.use('/contracts', contractsRouter)
router.use('/jobs', jobsRouter)
router.use('/balances', balancesRouter)

module.exports = router
