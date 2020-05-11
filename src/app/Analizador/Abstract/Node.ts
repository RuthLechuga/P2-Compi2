import {Tabla} from "../TablaSimbolos/Tabla";
import {Arbol} from "../TablaSimbolos/Arbol";
import {Tipo} from "../utils/Tipo";

export abstract class Node {
    fila: Number;
    columna: Number;
    tipo: Tipo;

    abstract analizar(tabla: Tabla, arbol: Arbol): any;

    abstract getC3D(tabla: Tabla, arbol: Arbol): String;
    
    abstract getArbol(arbol: String): String;

    constructor(tipo: Tipo, fila: Number, columna: number) {
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
    }
}