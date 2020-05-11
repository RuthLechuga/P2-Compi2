import {Node} from "../Abstract/Node";
import {Error} from "../Excepcion/Error";


export class Arbol {
    instrucciones: Array<Node>
    errores: Array<Error>
    console: Array<String>

    constructor(instrucciones : Array<Node>) {
        this.instrucciones = instrucciones;
        this.errores = new Array<Error>();
        this.console = new Array<String>();
    }
}