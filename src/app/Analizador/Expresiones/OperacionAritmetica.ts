import { Node } from "../Abstract/Node";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Tipo, Types } from "../utils/Tipo";
import { Error } from "../Excepcion/Error";

export class OperacionAritmetica extends Node {
    izquierdo: Node;
    derecho: Node;
    operador: String;
    constructor(izquierdo: Node, derecho: Node, operador: String, fila: number, columna: number) {
        super(null, fila, columna);
        this.izquierdo = izquierdo;
        this.derecho = derecho;
        this.operador = operador;
    }

    analizar(tabla: Tabla, arbol: Arbol): any {
        if (this.derecho === undefined) {
            const tipoIzq = this.izquierdo.analizar(tabla, arbol);

            if (tipoIzq.constructor.name === 'Error') {
                return tipoIzq;
            }

            if (tipoIzq.toString() == 'integer') {
                this.tipo = new Tipo(Types.INTEGER);
                return this.tipo;
            } 
            
            else if (tipoIzq.toString() == 'double') {
                this.tipo = new Tipo(Types.DOUBLE);
                return this.tipo;
            }
            
            else if (tipoIzq.toString() == 'char') {
                this.tipo = new Tipo(Types.CHAR);
                return this.tipo;
            }

            else if(tipoIzq.toString() == 'boolean'){
                this.tipo = new Tipo(Types.BOOLEAN);
                return this.tipo;
            }

            else {
                const excepcion = new Error('Semantico', `No se puede utilizar el operador ${this.operador} unario con el tipo ${tipoIzq.tipo}`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }


        } else {
            const tipoIzq = this.izquierdo.analizar(tabla, arbol);
            if (tipoIzq instanceof Error) {
                return tipoIzq;
            }
            const tipoDer = this.derecho.analizar(tabla, arbol);
            if (tipoDer instanceof Error) {
                return tipoDer;
            }

            if (this.operador === '+') {
                if (tipoIzq.toString() == 'integer' && tipoDer.toString() == 'integer' ||
                    tipoIzq.toString() == 'boolean' && tipoDer.toString() == 'integer' ||
                    tipoIzq.toString() == 'integer' && tipoDer.toString() == 'boolean' ||
                    tipoIzq.toString() == 'boolean' && tipoDer.toString() == 'boolean' ||
                    tipoIzq.toString() == 'integer' && tipoDer.toString() == 'char' ||
                    tipoIzq.toString() == 'boolean' && tipoDer.toString() == 'boolean' ||
                    tipoIzq.toString() == 'char' && tipoDer.toString() == 'integer') {

                    this.tipo = new Tipo(Types.INTEGER);
                    return this.tipo;

                } else if(tipoIzq.toString() == 'double' && tipoDer.toString() == 'double' ||
                        tipoIzq.toString() == 'double' && tipoDer.toString() == 'integer' ||
                        tipoIzq.toString() == 'integer' && tipoDer.toString() == 'double' ||
                        tipoIzq.toString() == 'double' && tipoDer.toString() == 'char' ||
                        tipoIzq.toString() == 'char' && tipoDer.toString() == 'double' ||
                        tipoIzq.toString() == 'double' && tipoDer.toString() == 'boolean' ||
                        tipoIzq.toString() == 'boolean' && tipoDer.toString() == 'double'){
                    this.tipo = new Tipo(Types.DOUBLE);
                    return this.tipo;

                } else if (tipoIzq.toString() == 'integer' && tipoDer.toString() == 'string' ||
                    tipoIzq.toString() == 'string' && tipoDer.toString() == 'integer' ||
                    tipoIzq.toString() == 'boolean' && tipoDer.toString() == 'string' ||
                    tipoIzq.toString() == 'string' && tipoDer.toString() == 'boolean' ||
                    tipoIzq.toString() == 'string' && tipoDer.toString() == 'double' ||
                    tipoIzq.toString() == 'double' && tipoDer.toString() == 'boolean' ||
                    tipoIzq.toString() == 'string' && tipoDer.toString() == 'char' ||
                    tipoIzq.toString() == 'char' && tipoDer.toString() == 'boolean' ||
                    tipoIzq.toString() == 'string' && tipoDer.toString() == 'string' ||
                    tipoIzq.toString()=='char' && tipoDer.toString() == 'char' ) {
                    this.tipo = new Tipo(Types.STRING);
                    return this.tipo;
 
                } else {
                    const excepcion = new Error('Semantico', `No se puede utilizar el operador ${this.operador} con los tipos ${tipoIzq.toString()} y ${tipoDer.toString()}`, this.fila, this.columna);
                    arbol.errores.push(excepcion);
                    return excepcion;
                }

            } else if(this.operador === '-' || this.operador === '*'){

                if (tipoIzq.toString() == 'integer' && tipoDer.toString() == 'integer' ||
                    tipoIzq.toString() == 'integer' && tipoDer.toString() == 'char' ||
                    tipoIzq.toString() == 'char' && tipoDer.toString() == 'integer' ||
                    tipoIzq.toString() == 'char' && tipoDer.toString() == 'char'){
                        this.tipo = new Tipo(Types.INTEGER);
                        return this.tipo;
                
                } else if(tipoIzq.toString() == 'double' && tipoDer.toString() == 'double' ||
                        tipoIzq.toString() == 'integer' && tipoDer.toString() == 'double' ||
                        tipoIzq.toString() == 'double' && tipoDer.toString() == 'integer' ||
                        tipoIzq.toString() == 'char' && tipoDer.toString() == 'double' ||
                        tipoIzq.toString() == 'double' && tipoDer.toString() == 'char'){
                            this.tipo = new Tipo(Types.DOUBLE);
                            return this.tipo;
                } else {
                    const excepcion = new Error('Semantico', `No se puede utilizar el operador ${this.operador} con los tipos ${tipoIzq.toString()} y ${tipoDer.toString()}`, this.fila, this.columna);
                    arbol.errores.push(excepcion);
                    return excepcion;
                }

            }else if (this.operador === '/' || this.operador === '^^') {

                if (tipoIzq.toString() == 'integer' && tipoDer.toString() == 'integer' ||
                    tipoIzq.toString() == 'double' && tipoDer.toString() == 'integer' ||
                    tipoIzq.toString() == 'integer' && tipoDer.toString() == 'double' ||
                    tipoIzq.toString() == 'char' && tipoDer.toString() == 'integer' ||
                    tipoIzq.toString() == 'integer' && tipoDer.toString() == 'char' ||
                    tipoIzq.toString() == 'double' && tipoDer.toString() == 'char' ||
                    tipoIzq.toString() == 'char' && tipoDer.toString() == 'double' ||
                    tipoIzq.toString() == 'double' && tipoDer.toString() == 'double' ||
                    tipoIzq.toString() == 'char' && tipoDer.toString() == 'char') {
                    this.tipo = new Tipo(Types.DOUBLE);
                    return this.tipo;
                } else {
                    const excepcion = new Error('Semantico', `No se puede utilizar el operador ${this.operador} con los tipos ${tipoIzq.toString()} y ${tipoDer.toString()}`, this.fila, this.columna);
                    arbol.errores.push(excepcion);
                    return excepcion;
                }

            } else if(this.operador === '%'){

                if (tipoIzq.toString() == 'integer' && tipoDer.toString() == 'integer'){
                    this.tipo = new Tipo(Types.INTEGER);
                    return this.tipo;
                } else {
                    const excepcion = new Error('Semantico', `No se puede utilizar el operador ${this.operador} con los tipos ${tipoIzq.toString()} y ${tipoDer.toString()}`, this.fila, this.columna);
                    arbol.errores.push(excepcion);
                    return excepcion;
                }
            }
        }
    }

    getC3D(tabla: Tabla, arbol: Arbol): String {
        let c3d = '';
        if (this.derecho === undefined) {
            c3d += this.izquierdo.getC3D(tabla, arbol);
            const temporalIzq = tabla.getTemporalActual();
            const temporal = tabla.getTemporal();

            c3d += `${temporal} = -1 * ${temporalIzq};\n`;
            tabla.QuitarTemporal(temporalIzq);
            tabla.AgregarTemporal(temporal);
            return c3d;
        } 

        else if(this.operador === '^^'){

        }
        
        else {
            
            c3d += this.izquierdo.getC3D(tabla, arbol);
            const temporalIzq = tabla.getTemporalActual();

            c3d += this.derecho.getC3D(tabla, arbol);
            const temporalDer = tabla.getTemporalActual();

            const temporal = tabla.getTemporal();
            c3d += `${temporal} = ${temporalIzq} ${this.operador} ${temporalDer};\n`;
            
            tabla.QuitarTemporal(temporalIzq);
            tabla.QuitarTemporal(temporalDer);
            tabla.AgregarTemporal(temporal);
            return c3d;
        }
    }

    getArbol(arbol: String): String {
        return '';
    }
}