import { Node } from "../Abstract/Node";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Error } from "../Excepcion/Error";

export class Importar extends Node {

    archivo: String;
    fila: number;
    columna: number;

    constructor(archivo: String, fila: number, columna: number) {
        super(null, fila, columna);
        this.archivo = archivo;
        this.fila = fila;
        this.columna = columna;
    }

    analizar(tabla: Tabla, arbol: Arbol) : any{
        console.log('importar!!!:::', this.archivo);
        return '';
    }

    getC3D(tabla: Tabla, arbol: Arbol) : String {
        return '';
    }

    getArbol(arbol: String): String {
        return '';
    }
}