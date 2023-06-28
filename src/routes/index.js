const { Router } = require('express')
const contractsRouter = require('./contracts.routes')

const router = Router()

router.use('/contracts', contractsRouter)

module.exports = router
