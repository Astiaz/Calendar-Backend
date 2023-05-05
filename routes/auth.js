/* 
    Rutas de Usuarios / Auth
    host + /api/auth
*/


const { Router } = require('express');
const { check } = require('express-validator');
const { loginUser, createUser, renewToken } = require('../controllers/auth');
const { fieldValidators } = require('../middlewares/fieldValidators');
const { jwtValidator } = require('../middlewares/jwtValidator');

const router = Router();

router.post(
    '/', 
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe contener mas de 6 caracteres').isLength({ min:6 }),
        fieldValidators
    ],
    loginUser 
);

router.post(
    '/new',
    [ //Middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min:6 }),
        fieldValidators
    ],
    createUser 
);

router.get('/renew', jwtValidator, renewToken );

module.exports = router;