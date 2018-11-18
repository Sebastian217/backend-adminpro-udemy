// Requires (Librerias que va a tener el proyecto)
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

var app = express();

//Obtenemos toda la tabla de usuarios
var Usuario = require('../models/usuario');


//=============================================================
// Logearese
//=============================================================

app.post('/', (req, res) => {

    var body = req.body;

   // Verificamos si el usuario con ese correo existe en la db
    Usuario.findOne({ email: body.email}, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });

        }
        
        if ( !bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });

        }

        // Crear un token !!!
        usuarioDB.password = 'null';
        var token = jwt.sign({ usuarios: usuarioDB}, config.SEED, { expiresIn: 14400 }); // 4 horas
         
        res.status(200).json({
            ok: true,
            usuarios: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    })

   
});


module.exports = app;