const { RESERVED } = require('mysql2/lib/constants/client')
const User = require('../models/User')

class UserController {
    async index(req, res) {

    }

    async create(req, res) {
        let {name, email, password} = req.body

        if(email == undefined) {
            res.status(400)
            res.json({err: 'O e-mail é inválido'})
            return
        }

        let emailExists = await User.findEmail(email)

        if(emailExists) {
            res.status(406)
            res.json({err: 'O e-mail já existe na base de dados'})
            return // Garantir que nada abaixo seja executado
        }

        await User.new(name, email, password)

        res.status(200)
        res.json('Tudo OK!')
    }
}

module.exports = new UserController()