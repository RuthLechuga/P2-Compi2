import {Node} from "../Abstract/Node";
import {Error} from "../Excepcion/Error";


export class Arbol {
    instrucciones: Array<Node>
    errores: Array<Error>

    constructor(instrucciones : Array<Node>) {
        this.instrucciones = instrucciones;
        this.errores = new Array<Error>();
    }
}