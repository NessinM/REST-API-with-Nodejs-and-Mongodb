import api     from '../api'

const collection = "menu"

export const getByPerfil = async (req, res) => {
  const { perfil }                = req.decoded
  const resultado                 = await api.mongo.actions.find(collection)
  const { status, data, message } = resultado[0]
  if (!status) res.send({ status, message})
  else {
    let menus = []
    await data.forEach( async (menu, index) => {
      if (menu.allows.includes(perfil)) {
        const { children, ...obj_menu } = menu
        obj_menu.children = []
        await menu.children.forEach((item, index_item) => {
          if (item.allows.includes(perfil)) obj_menu.children.push(item)
        })
        menus.push(obj_menu)
      }
    })
    res.send({ status, data : menus })
  }
}
