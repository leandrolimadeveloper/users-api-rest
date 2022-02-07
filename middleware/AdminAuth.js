const jwt = require('jsonwebtoken')
const secret = 'jklajskdjalsji221jnna221aasvbwrwq'

module.exports = function(req, res, next) {
    const authToken = req.headers['authorization']
    
    if(authToken != undefined) {
        const bearer = authToken.split(' ')
        let token = bearer[1]
        try{
            let decoded = jwt.verify(token, secret)
            console.log(decoded)
            next()
        } catch(err) {
            res.status(403)
            res.send('Você não está autenticado')
            return
        }
    } else {
        res.status(403)
        res.send('Você não está autenticado')
        return
    }
}