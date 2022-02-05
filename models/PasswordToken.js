const knex = require('../database/connection')
const User = require('./User')

class PasswordToken {
    async create(email) {
        let user = await User.findByEmail(email)
        if(user != undefined) {
            try {
                let token = Date.now()
                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token
                }).table('password_tokens')
                return {status: true, token: token}
            } catch(err) {
                console.log(err)
                return {status: false, err: err}
            }
        } else {
            return {status: false, err: 'E-mail não encontrado na base de dados'}
        }
    }

    async validade(token) {
        try{
            let result = await knex.select().where({token: token}).table('password_tokens')

            if(result.length > 0) {
                let tk = result[0]

                if(tk.used) {
                    return {status: false}
                } else {
                    return {status: true, token: tk}
                }
            }
        } catch(err) {
            console.log(err)
            return false
        }
    }

    async setUsed(token) {
        await knex.update({used: 1}).where({token: token}).table('password_tokens')
    }
}

module.exports = new PasswordToken()
