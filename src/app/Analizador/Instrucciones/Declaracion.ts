import { Node } from "../Abstract/Node";
import { Tipo, Types } from "../utils/Tipo";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Simbolo } from "../TablaSimbolos/Simbolo";
import { Error } from "../Excepcion/Error";
import { Primitivo } from '../Expresiones/Primitivo';

export class Declaracion extends Node {
    
    identificador: String;
    valor: Node;
    posicion: number;
    isConst: boolean;
    isGlobal: boolean;
    fila: number;
    columna: number;

    constructor(tipo: Tipo, identificador: String, valor: Node, isConst: boolean, isGlobal: boolean, fila: number, columna: number) {
        super(tipo, fila, columna);
        this.identificador = identificador;
        this.valor = valor;
        this.posicion = 0;
        this.fila = fila;
        this.columna = columna;
        this.isConst = isConst;
        this.isGlobal = isGlobal;
    }

    analizar(tabla: Tabla, arbol: Arbol) : any{
        
        const exists = tabla.getVariable(this.identificador);
        if (exists !== null) {
            const excepcion = new Error('Semantico', `La variable ${this.identificador} ya existe.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }

        if (this.valor != null) {
            const tipo = this.valor.analizar(tabla, arbol);

            if (tipo.constructor.name === 'Error') {
                return tipo;
            }

            if(this.tipo == null){
                switch(tipo.toString()){
                    case 'integer': this.tipo = new Tipo(Types.INTEGER); break;
                    case 'double': this.tipo = new Tipo(Types.DOUBLE); break;
                    case 'boolean': this.tipo = new Tipo(Types.BOOLEAN); break;
                    case 'char': this.tipo = new Tipo(Types.CHAR); break;
                    case 'string': this.tipo = new Tipo(Types.STRING); break;
                    default:
                        this.tipo = new Tipo(Types.STRUCT);
                        this.tipo.tipoObjeto = tipo;
                }
            } 

            if (tipo.toString() !== this.tipo.toString() && 'struct' === this.tipo.tipoObjeto.toString()) {
                const excepcion = new Error('Semantico', `El tipo de la variable no coincide con el tipo del valor ${this.tipo.toString()} = ${tipo.toString()}.`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
        }
        else{
            switch(this.tipo.toString()){
                case 'integer': this.valor = new Primitivo(new Tipo(Types.INTEGER), 0, this.fila, this.columna); break;
                case 'double': this.valor = new Primitivo(new Tipo(Types.INTEGER), 0.0, this.fila, this.columna); break;
                case 'boolean': this.valor = new Primitivo(new Tipo(Types.INTEGER), true, this.fila, this.columna); break;
                case 'char': this.valor = new Primitivo(new Tipo(Types.INTEGER), '', this.fila, this.columna); break;
                case 'string': this.valor = new Primitivo(new Tipo(Types.INTEGER), null, this.fila, this.columna); break;
                default:
                    this.valor = null;
            }
        }

        // Si pasa por todas las validaciones, entonces se puede agregar a la ts
        let nuevo = new Simbolo(this.tipo, this.identificador, this.posicion);
        nuevo.setPosicion(this.fila,this.columna);
        nuevo.isConst = this.isConst;
        tabla.setVariable(nuevo);
    }

    getC3D(tabla: Tabla, arbol: Arbol) : String {
        
        let codigo = '';
        let variable = tabla.getVariable(this.identificador);
        if (this.valor != null) {
            let valor3D = this.valor.getC3D(tabla, arbol);

            codigo += valor3D;

            if (!tabla.ambito) {
                codigo += `heap[${variable.posicion}] = ${tabla.getTemporalActual()};\n`;
            } else {
                let temp = tabla.getTemporalActual();
                let temp2 = tabla.getTemporal();
                
                codigo += `${temp2} = P; \n`;
                codigo += `${temp2} = ${temp2} + ${variable.posicion};\n`;
                codigo += `stack[${temp2}] = ${temp};\n`;
            }

            tabla.QuitarTemporal(tabla.getTemporalActual());
        } else {
            let temp = tabla.getTemporal();
            if (['integer', 'boolean','char','double'].includes(this.tipo.toString())) {
                codigo += `${temp} = 0;\n`;
            } else {
                codigo += `${temp} = -1;\n`;
            }
        }
        return codigo;
    }

    getArbol(arbol: String): String {
        return '';
    }
}