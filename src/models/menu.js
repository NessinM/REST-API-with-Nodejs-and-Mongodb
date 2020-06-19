import api     from '../api'

const collection = "menu"

export const get = async (req, res) => {
  const { perfil }                  = req.decoded
  const [{ message, status, data }] = await api.mongo.actions.find(collection)
  if (!status) res.send({ status, message})
  else {
    let menus = []
    await data.forEach( async menu => {
      if (menu.allows.includes(perfil)) {
        const { children, ...obj_menu } = menu
        obj_menu.children = []
        await menu.children.forEach(item => item.allows.includes(perfil) && obj_menu.children.push(item))
        menus.push(obj_menu)
      }
    })
    res.send({ status, data : menus })
  }
}