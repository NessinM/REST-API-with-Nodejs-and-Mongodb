import express, { urlencoded, json } from 'express'
import cors                          from 'cors'
const app = express();
// Middlewares
app.use(urlencoded({ extended: false }))
app.use(json())
app.use(cors())

// Routes
app.use('/',      require('./routes'))
app.use('/tasks', require('./routes/tasks'))

export default app;