var jwt = require('jsonwebtoken');
var config = require('../config/config');


//=============================================================
// Verificar token - Lo va hacer con los metodos (put, post y delete)
//=============================================================

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, config.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }


        // Obtenemos la informacion del usuaio.
        req.usuarios = decoded.usuarios;

        // Le agregamos el next para que continue con las peticiones de mas abajo, que seria el put, post y delete. 
        next();
    });

}
