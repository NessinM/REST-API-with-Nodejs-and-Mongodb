import general from '../utils/general'
import api     from '../api'

export const getAll =  async (req, res) => {
  const resultado = await api.mongo.task.action('find')
  const response  = await resultado[0]
  if (!response.status)  res.send(general.trowError(response.message))
  else {
    response.status = response.status
    response.data   = response.data
    res.send(response)
  }
}

export const getOne =   async (req, res) => {
  const id        = req.params.id
  const resultado = await api.mongo.task.action('findOne', {_id : id})
  const response  = await resultado[0]
  if (!response.status)  res.send(general.trowError(response.message))
  else {
    response.status = response.status
    response.data   = response.data
    res.send(response)
  }
}

export const add =  async (req, res) => {
  const title       = req.body.title
  const description = req.body.description

  const new_task = {
    title,
    description
  }

  const resultado = await api.mongo.task.action('insert', new_task)
  const response  = await resultado[0]
  if (!response.status)  res.send(general.trowError(response.message))
  else {
    response.status = response.status
    response.data   = response.data
    res.send(response)
  }
}

export const remove =  async (req, res) => {
  const id        = req.params.id

  const resultado = await api.mongo.task.action('remove', {_id : id })
  const response  = await resultado[0]
  if (!response.status)  res.send(general.trowError(response.message))
  else {
    response.status = response.status
    response.data   = response.data
    res.send(response)
  }
}

export const update =  async (req, res) => {
  const id          = req.params.id
  const title       = req.body.title
  const description = req.body.description

  const new_task = {
    title,
    description
  }

  const resultado = await api.mongo.task.action('updateOne', {_id : id, ...new_task})
  const response  = await resultado[0]
  if (!response.status)  res.send(general.trowError(response.message))
  else {
    response.status = response.status
    response.data   = response.data
    res.send(response)
  }
}
