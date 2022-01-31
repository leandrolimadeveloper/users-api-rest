class UserController {
    async index(req, res) {

    }

    async create(req, res) {
        let {email, name, password} = req.body

        if(email == undefined) {
            res.status(400)
            res.json({err: 'O e-mail é inválido'})
        }

        res.status(200)
        res.json('Tudo OK!')
    }
}

module.exports = new UserController()