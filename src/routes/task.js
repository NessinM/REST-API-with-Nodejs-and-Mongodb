import { Router }  from 'express'
const router  = Router()

const mw   = require('../middlewares')
const task = require('../models/task')

router.get('/',       mw.isLogged, task.getAll)
router.get('/:id',    mw.isLogged, task.getOne)
router.post('/',      mw.isLogged, task.add)
router.put('/:id',    mw.isLogged, task.update);
router.delete('/:id', mw.isLogged, task.remove);

module.exports = router
