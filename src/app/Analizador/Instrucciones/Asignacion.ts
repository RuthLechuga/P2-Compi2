import { Node } from "../Abstract/Node";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Error } from "../Excepcion/Error";

export class Asignacion extends Node{

    identificador: String;
    valor: Node;

    constructor(identificador: String, valor: Node, fila: number, columna: number) {
        super(null, fila, columna);
        this.identificador = identificador;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;
    }

    analizar(tabla: Tabla, arbol: Arbol) : any{
        
        const exists = tabla.getVariable(this.identificador);
        if (exists === null) {
            const excepcion = new Error('Semantico', `La variable ${this.identificador} no existe.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }

        if(exists.isConst){
            const excepcion = new Error('Semantico', `${this.identificador} es una constante y su valor no puede ser modificado.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }

        const tipo = this.valor.analizar(tabla, arbol);

        if (tipo.constructor.name === 'Excepcion') {
            return tipo;
        }

        if (exists.tipo.toString() !== tipo.toString()) {
            const excepcion = new Error('Semantico', `La variable con tipo ${exists.tipo.toString()} no es igual al tipo ${tipo.toString()}`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
    }

    getC3D(tabla: Tabla, arbol: Arbol) : String {
        let codigo = '';
        let variable = tabla.getVariable(this.identificador);
        let valor3D = this.valor.getC3D(tabla, arbol);
        codigo += valor3D;
        
        if (!tabla.ambito || variable.isGlobal) {
            codigo += `heap[${variable.posicion}] = ${tabla.getTemporalActual()};\n`;
        } else {
            let temp = tabla.getTemporalActual();
            let temp2 = tabla.getTemporal();
            codigo += `${temp2} = P;\n`;
            codigo += `${temp2} = ${temp2} + ${variable.posicion};\n`;
            codigo += `stack[${temp2}] = ${temp};\n`;
        }
        return codigo;
    }

    getArbol(arbol: String): String {
        return '';
    }
}