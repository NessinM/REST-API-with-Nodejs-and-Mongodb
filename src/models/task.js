import api from '../api'

export const getAll =  async (req, res) => {
  const response = await api.mongo.task.action('find')
  res.send(response)
}

export const getOne =   async (req, res) => {
  const id       = req.params.id
  const response = await api.mongo.task.action('findOne', {_id : id})
  res.send(response)
}

export const add =  async (req, res) => {
  const title       = req.body.title
  const description = req.body.description
  const response    = await api.mongo.task.action('insert', { title, description })
  res.send(response)
}

export const remove =  async (req, res) => {
  const id       = req.params.id
  const response = await api.mongo.task.action('remove', {_id : id })
  res.send(response)
}

export const update =  async (req, res) => {
  const id          = req.params.id
  const title       = req.body.title
  const description = req.body.description
  const response    = await api.mongo.task.action('updateOne', {_id : id, title, description})
  res.send(response)
}
