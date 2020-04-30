import { Router }  from 'express'
const router  = Router()

const mw   = require('../middlewares')
const vacacion = require('../models/vacacion')

router.get('/',       mw.isLogged, vacacion.getAll)
router.get('/uso',       mw.isLogged, vacacion.getUso)

module.exports = router
