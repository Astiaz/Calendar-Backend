const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generarJWT } = require('../helpers/jwt');

const loginUser = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        
        const usuario = await User.findOne({email});
        
        if( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario y contrasena no correctos'
            });
        }

        // Confirmar los passwords

        const validPassword = bcrypt.compareSync( password, usuario.password);

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
    
    

}

const createUser = async(req, res = response) => {
    
    const { email, password } = req.body;
    
    try {
        let usuario = await User.findOne({email: email});
        
        if( usuario )  {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe una cuenta con ese correo'
            })
        }
        
        usuario = new User( req.body );
        
        // Encriptar psswrd
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
        
        await usuario.save();

        // Generar JWT
    
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador'
        })
    }
}

const renewToken = async(req, res = response) => {

    const { uid, name } = req;

    // generar nuevo jwt y retornarlo
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token
    })
}

module.exports = {
    loginUser,
    createUser,
    renewToken
}