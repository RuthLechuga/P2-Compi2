import {Tipo} from "../utils/Tipo";

/**
 * @class Esta clase me permite almacenar información relevante de variables
 */
export class Simbolo {
    tipo: Tipo;
    identificador: String;
    posicion: number;
    linea: number;
    columna: number;
    isConst: boolean;
    
    constructor(tipo: Tipo, identificador: String, posicion: number) {
        this.tipo = tipo;
        // this.type = tipo.toString();
        this.identificador = identificador;
        this.posicion = posicion;
        this.linea = 0;
        this.columna = 0;
        this.isConst = false;
    }

    setPosicion(linea: number, columna: number){
        this.linea = linea;
        this.columna = columna;
    }
}