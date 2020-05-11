import {Tipo} from "../utils/Tipo";

export class Simbolo {
    tipo: Tipo;
    identificador: String;
    posicion: number;
    linea: number;
    columna: number;
    isConst: boolean;
    
    constructor(tipo: Tipo, identificador: String, posicion: number, linea: number, columna: number, isConst: boolean) {
        this.tipo = tipo;
        this.identificador = identificador;
        this.posicion = posicion;
        this.linea = this.linea;
        this.columna = this.columna;
        this.isConst = this.isConst;
    }
}