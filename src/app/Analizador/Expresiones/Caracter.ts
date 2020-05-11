import { Node } from "../Abstract/Node";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Tipo, Types } from "../utils/Tipo";

export class Caracter extends Node{
    
    caracter: any;

    constructor(caracter: String, fila: number, columna: number) {
        super(new Tipo(Types.CHAR), fila, columna);
        this.caracter = caracter;
    }

    analizar(tabla: Tabla, arbol: Arbol) : any{
        return this.tipo;
    }

    getC3D(tabla: Tabla, arbol: Arbol) : String{
        const temporal = tabla.getTemporal();
        let c3d = `${temporal} = ${this.caracter.charCodeAt(0)};\n`;
        tabla.AgregarTemporal(tabla.getTemporalActual());
        return c3d;
    }

    getArbol(arbol: String): String {
        throw new Error("Method not implemented.");
    }
}