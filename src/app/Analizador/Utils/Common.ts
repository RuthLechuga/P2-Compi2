import { Tabla } from "../TablaSimbolos/Tabla";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Funcion } from "../Instrucciones/Funcion";
import { SimboloFuncion } from "../TablaSimbolos/SimboloFuncion";
import { Error } from "../Excepcion/Error";
import { Node } from "../Abstract/Node";
import { Declaracion } from "../Instrucciones/Declaracion";
import { Si } from "../Instrucciones/Si";
import { HacerMientras } from "../Instrucciones/HacerMientras";
import { Mientras } from "../Instrucciones/Mientras";

export enum Visibilidad {
    PUBLIC,
    PRIVATE
}

export function agregarFuncion(tabla: Tabla, arbol: Arbol, funcion: Funcion) {

    const tipo = funcion.tipo;

    const identificador = funcion.nombre;
    const parametros = funcion.parametros.length;
    tabla.setStack(1);
    funcion.parametros.map(m => {
        m.posicion = tabla.getStack();
    });

    const functionSize = getFuncionSize(tabla, funcion.instrucciones) + parametros + 1;
    const simbolo = new SimboloFuncion(tipo, identificador, parametros, functionSize, funcion);
    const result = tabla.setFuncion(simbolo);
    if (result != null) {
        arbol.errores.push(new Error('Semantico', result, funcion.fila, funcion.columna));
    }
}

export function getFuncionSize(tabla: Tabla, instrucciones: Array<Node>) {
    let size = 0;
    for (const i in instrucciones) {
        const currentIns = instrucciones[i];
        if (currentIns instanceof Declaracion) {
            size = size + 1;
            currentIns.posicion = tabla.getStack();
        } else if (currentIns instanceof Si) {
            size = size + getFuncionSize(tabla, currentIns.listaIf);
            size = size + getFuncionSize(tabla, currentIns.listaElse);
        } else if (currentIns instanceof HacerMientras || currentIns instanceof Mientras) {
            size = size + getFuncionSize(tabla, currentIns.instrucciones);
        } else {
            continue;
        }
    }
    return size;
}