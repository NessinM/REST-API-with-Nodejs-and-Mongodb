import { Router }  from 'express'
const router  = Router()

const mw   = require('../middlewares')
const user = require('../models/user')

router.get('/',       mw.isLogged, user.getAll)
router.get('/:id',    mw.isLogged, user.getOne)
router.post('/',      mw.isLogged, user.add)
router.put('/:id',    mw.isLogged, user.update)
router.delete('/:id', mw.isLogged, user.remove)
router.post('/login', user.login)
router.post('/logout', mw.isLogged, user.logout)

module.exports = router
