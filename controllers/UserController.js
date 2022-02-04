const { RESERVED } = require('mysql2/lib/constants/client')
const User = require('../models/User')
const { use } = require('../routes/routes')

class UserController {
    async index(req, res) {
        let users = await User.findAll()
        res.json(users)
    }

    async findUser(req, res) {
        let id = req.params.id
        let user = await User.findById(id)

        if(user == undefined) {
            res.status(404)
            res.json({})
        } else {
            res.status(200)
            res.json(user)
        }
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

    async edit(req, res) {
        let {id, name, email, role} = req.body
        let result = await User.update(id, name, email, role)
        if(result != undefined) {
            if(result.status) {
                res.status(200)
                res.send('Alteração feita com sucesso!')
            } else {
                res.status(406)
                res.send(result.err)
            }
        } else {
            res.status(406)
            res.send('Ocorreu um erro no servidor')
        }
    }

    async delete(req, res) {
        let id = req.params.id

        let result = await User.delete(id)

        if(result.status) {
            res.status(200)
            res.send('Usuário deletado')
        } else {
            res.status(406)
            res.send(result.err)
        }
    }
}

module.exports = new UserController()