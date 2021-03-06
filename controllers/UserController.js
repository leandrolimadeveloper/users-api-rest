const User = require('../models/User')
const PasswordToken = require('../models/PasswordToken')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const secret = 'jklajskdjalsji221jnna221aasvbwrwq'

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

    async recoverPassword(req, res) {
        let email = req.body.email
        let result = await PasswordToken.create(email)
        
        if(result.status) {
            res.status(200)
            res.send("" + result.token) // Converter para String para o Node não reconhecer como um código de status
        } else {
            res.status(406)
            res.send(result.err)
        }
    }

    async changePassword(req, res) {
        let token = req.body.token
        let password = req.body.password
        let isTokenValid = await PasswordToken.validade(token)

        if(isTokenValid.status) {
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token) 
            res.status(200)
            res.send('Senha alterada')
        } else {
            res.status(406)
            res.send('Token Inválido')
        }
    }

    async login(req, res) {
        let {email, password} = req.body

        let user = await User.findByEmail(email)

        if(user != undefined) {
            let resultado = await bcrypt.compare(password, user.password)
            
            if(resultado) {
                let token = jwt.sign({email: user.email, role: user.role}, secret)
                res.status(200)
                res.json({token: token})
            }
            
            res.json({status: resultado})
        } else {
            res.status(406)
            return {status: false}
        }
    }
}

module.exports = new UserController()