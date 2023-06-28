const { Router } = require('express')
const contractsRouter = require('./contracts.routes')
const jobsRouter = require('./jobs.routes')

const router = Router()

router.use('/contracts', contractsRouter)
router.use('/jobs', jobsRouter)

module.exports = router
