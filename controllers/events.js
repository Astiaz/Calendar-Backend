

// {
//     ok: true,
//     msg: 'Obtener eventos'
// }

const { response } = require('express');
const Event = require('../models/Event');

const getEventos = async( req, res = response) => {

    const Events = await Event.find().populate('user', 'name');

    res.status(200).json({
        ok: true,
        Events
    })
};

const crearEventos = async( req, res = response) => {

    // Verificar evento
    const evento = new Event( req.body );

    try {
        
        evento.user = req.uid;

        const savedEvent = await evento.save()

        res.json({
            ok: true,
            savedEvent
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

};

const actualizarEventos = async( req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        
        const event = await Event.findById(eventId);

        if( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe'
            });
        }
        
        if( event.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene los permisos de editar este evento'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {new: true});

        res.json({
            ok: true,
            event: updatedEvent,
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};

const borrarEventos = async( req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;
    
    try {

        const event = await Event.findById(eventId);

        if( !event ) { 
            return res.status(400).json({
                ok: false,
                msg: 'El evento no existe'
            });
        }
    
        if( event.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para borrar este evento'
            })
        }

        const deletedEvent = await Event.findByIdAndDelete(eventId);
    
        res.status(200).json({
            ok: true,
            event: deletedEvent
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }

};

module.exports = { 
    crearEventos,
    borrarEventos,
    actualizarEventos,
    getEventos
}