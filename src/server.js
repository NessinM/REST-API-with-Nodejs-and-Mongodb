import express, { urlencoded, json } from 'express'
import cors                          from 'cors'
const app = express();
// Middlewares
app.use(urlencoded({ extended: false }))
app.use(json())
app.use(cors())

// Routes
app.use('/',      require('./routes'))
app.use('/task', require('./routes/task'))
app.use('/user', require('./routes/user'))

export default app;