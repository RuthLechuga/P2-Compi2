import { Simbolo } from "../TablaSimbolos/Simbolo";
import { SimboloFuncion } from "../TablaSimbolos/SimboloFuncion";

export class Tabla {
    variables: Array<Simbolo>;
    funciones: Array<SimboloFuncion>;
    temporal: number;
    etiqueta: number;
    heap: number;
    stack: number;
    tempStorage: Array<String>;
    ambito: Boolean;
    listaReturn: Array<String>;
    sizeActual: Array<number>;

    constructor() {
        this.variables = [];
        this.funciones = [];
        this.temporal = 0;
        this.etiqueta = 0;
        this.heap = 0;
        this.stack = 0;
        this.tempStorage = [];
        this.ambito = false; // false = global, true = local
        this.listaReturn = [];
        this.sizeActual = [];
    }

    setVariable(simbolo: Simbolo): String {
        for (let i of this.variables) {
            if (i.identificador === simbolo.identificador) {
                return `La variable ${simbolo.identificador} ya existe.`
            }
        }
        this.variables.push(simbolo);
        return null;
    }

    getVariable(identificador: String): Simbolo {
        for (let i of this.variables) {
            if (i.identificador === identificador) {
                return i;
            }
        }
        return null;
    }

    setFuncion(simbolo: SimboloFuncion): String {
        for (let i of this.funciones) {
            if (i.identificador === simbolo.identificador) {
                return `La funcion ${simbolo.identificador} ya existe.`
            }
        }
        this.funciones.push(simbolo);
        return null;
    }

    getFuncion(identificador: String): SimboloFuncion {
        for (let i of this.funciones) {
            if (i.identificador === identificador) {
                return i;
            }
        }
        return null;
    }

    getTemporal(): String {
        return "t" + ++this.temporal;
    }

    getTemporalActual(): String {
        return "t" + this.temporal;
    }

    getHeap(): number {
        return this.heap++;
    }

    getStack(): number {
        return this.stack++;
    }

    setStack(value: number): void {
        this.stack = value;
    }

    getEtiqueta(): String {
        return "L" + ++this.etiqueta;
    }

    getEtiquetaActual(): String {
        return "L" + this.etiqueta;
    }

    AgregarTemporal(temp: String): void {
        if (this.tempStorage.indexOf(temp) == -1) {
            this.tempStorage.push(temp);
        }
    }

    QuitarTemporal(temp: String): void {
        let index = this.tempStorage.indexOf(temp);
        if (index > -1) {
            this.tempStorage.splice(index, 1);
        }
    }

    getTotalTemporales(): number {
        return this.temporal;
    }
}