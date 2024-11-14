const Alexa = require('ask-sdk-core');

let proyectos = []; 

function agregarProyecto(nombre, fechaLimite, tareas) {
    proyectos.push({
        nombre,
        fechaLimite,
        tareas
    });
}

function obtenerProyectos() {
    if (proyectos.length === 0) {
        return 'No tienes proyectos en este momento.';
    }

    let mensaje = 'Tus proyectos actuales son: ';
    proyectos.forEach(proyecto => {
        mensaje += `${proyecto.nombre} con fecha límite el ${proyecto.fechaLimite}. `;
    });
    return mensaje;
}

const AgregarProyectoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AgregarProyectoIntent';
    },
    handle(handlerInput) {
        const { nombreProyecto, fechaLimite } = handlerInput.requestEnvelope.request.intent.slots;
        const tareas = handlerInput.requestEnvelope.request.intent.slots.tareas.value || 'Sin tareas definidas';

        agregarProyecto(nombreProyecto.value, fechaLimite.value, tareas);

        const speakOutput = El proyecto ${ nombreProyecto.value
} con fecha límite el ${ fechaLimite.value } ha sido agregado.;
return handlerInput.responseBuilder
    .speak(speakOutput)
    .getResponse();
    }
};

const ObtenerProyectosIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ObtenerProyectosIntent';
    },
    handle(handlerInput) {
        const speakOutput = obtenerProyectos();
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const AgregarTareaIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AgregarTareaIntent';
    },
    handle(handlerInput) {
        const { nombreProyecto, tarea } = handlerInput.requestEnvelope.request.intent.slots;
        const proyecto = proyectos.find(proy => proy.nombre === nombreProyecto.value);

        if (proyecto) {
            proyecto.tareas += , ${ tarea.value };
            const speakOutput = La tarea ${ tarea.value
} ha sido agregada al proyecto ${ nombreProyecto.value }.;
return handlerInput.responseBuilder
    .speak(speakOutput)
    .getResponse();
        } else {
    const speakOutput = No se encontró un proyecto llamado ${ nombreProyecto.value }.;
    return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
}
    }
};

const RecordatorioIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RecordatorioIntent';
    },
    handle(handlerInput) {
        const { nombreProyecto } = handlerInput.requestEnvelope.request.intent.slots;
        const proyecto = proyectos.find(proy => proy.nombre === nombreProyecto.value);

        if (proyecto) {
            const speakOutput = El proyecto ${ proyecto.nombre
} tiene fecha límite el ${ proyecto.fechaLimite }. ¡Recuerda completar tus tareas!;
return handlerInput.responseBuilder
    .speak(speakOutput)
    .getResponse();
        } else {
    const speakOutput = No se encontró un proyecto llamado ${ nombreProyecto.value }.;
    return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
}
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Bienvenido a la Skill de Organización de Proyectos de Estudio. Puedes agregar, consultar o modificar tus proyectos.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.error(Error handled: ${ error.message });
        return handlerInput.responseBuilder
            .speak('Lo siento, ocurrió un error. Por favor, inténtalo de nuevo.')
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AgregarProyectoIntentHandler,
        ObtenerProyectosIntentHandler,
        AgregarTareaIntentHandler,
        RecordatorioIntentHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();