

const { Router } = require('express');
const { jwtValidator } = require('../middlewares/jwtValidator');
const { fieldValidators } = require('../middlewares/fieldValidators');
const { getEventos, crearEventos, actualizarEventos, borrarEventos } = require('../controllers/events');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');

const router = Router();

// Validate Token
router.use( jwtValidator );

// Obtener eventos
router.get('/', getEventos);

// Crear evento
router.post('/', 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha final es obligatoria').custom( isDate ),
        fieldValidators
    ],
    crearEventos
);

// Actualizar evento
router.put('/:id', actualizarEventos);

// Borrar evento
router.delete('/:id', borrarEventos);

module.exports = router;