import {Tipo} from "../utils/Tipo";
import {Funcion} from "../Instrucciones/Funcion";

export class SimboloFuncion {
    tipo: Tipo;
    identificador: String;
    parametros: number;
    size_function: number;
    funcion: Funcion;

    constructor(tipo: Tipo, identificador: String, parametros: number, size_function: number, funcion: Funcion) {
        this.tipo = tipo;
        this.identificador = identificador;
        this.parametros = parametros;
        this.size_function = size_function;
        this.funcion = funcion;
    }
}