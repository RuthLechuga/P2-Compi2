import {Tipo} from "../utils/Tipo";

export class Simbolo {
    tipo: Tipo;
    identificador: String;
    posicion: number;
    linea: number;
    columna: number;
    isConst: boolean;
    isGlobal: boolean;
                
    constructor(tipo: Tipo, identificador: String, posicion: number, linea: number, columna: number, isConst: boolean, isGlobal: boolean) {
        this.tipo = tipo;
        this.identificador = identificador;
        this.posicion = posicion;
        this.linea = linea;
        this.columna = columna;
        this.isConst = isConst;
        this.isGlobal = isGlobal;
    }
}