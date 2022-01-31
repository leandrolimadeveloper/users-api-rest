const knex = require('../database/connection')
const bcrypt = require('bcrypt')

class User {
    async new(name, email, password) {
        try {
            
            // bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
            //     // Store hash in your password DB.
            // });

            let hash = await bcrypt.hash(password, 10)
            
            await knex.insert({name, email, password: hash, role: 0}).table('users')
        } catch(err) {
            console.log(err)
        }
    }

    async findEmail(email) {
        try {
            let result = await knex.select('*').from('users').where({email: email})
            
            if(result.length > 0) {
                return true // E-mail já está cadastro
            } else {
                return false 
            }

        } catch(err) {
            console.log(err)
            return false
        }
    }
}

module.exports = new User()