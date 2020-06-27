import { Router }  from 'express'
const router  = Router()

const mw   = require('../middlewares')
const contrato = require('../models/contrato')

router.get('/',        mw.isLogged, contrato.get)
router.get('/user',    mw.isLogged, contrato.getByUser)
router.post('/',       mw.isLogged, contrato.add)
router.put('/',        mw.isLogged, contrato.update)
// router.delete('/',     mw.isLogged, user.remove)

module.exports = router
