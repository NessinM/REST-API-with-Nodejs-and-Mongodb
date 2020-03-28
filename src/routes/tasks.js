import { Router }  from 'express'
const router  = Router()

// const mw   = require('../model/middleware')
const task = require('../models/task')

router.get('/',       task.getAll)
router.get('/:id',    task.getOne)
router.post('/',      task.add)
router.put('/:id',    task.update);
router.delete('/:id', task.remove);

module.exports = router
