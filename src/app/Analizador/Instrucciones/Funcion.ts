import { Node } from "../Abstract/Node";
import { Tipo } from "../utils/Tipo";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Error } from "../Excepcion/Error";
import { Declaracion } from "./Declaracion";
import { Visibilidad } from '../Utils/Common';

export class Funcion extends Node{

    visibilidad: Visibilidad;
    nombre: String;
    parametros: Array<Declaracion>;
    instrucciones: Array<Node>;

    constructor(visibilidad: Visibilidad, tipo: Tipo, nombre: String, parametros: Array<Declaracion>, instrucciones: Array<Node>, fila: number, columna: number) {
        super(tipo, fila, columna);
        this.visibilidad = visibilidad;
        this.nombre = nombre;
        this.parametros = parametros;
        this.instrucciones = instrucciones;
        this.parametros.map(m => {
            this.nombre += '_' + m.tipo.toString();
        });
    }

    analizar(tabla: Tabla, arbol: Arbol) : any{
        this.parametros.map(m => {
            m.analizar(tabla, arbol);
        });

        this.instrucciones.map(m => {
            m.analizar(tabla, arbol);
        });
    }

    getC3D(tabla: Tabla, arbol: Arbol) : String {
        const existeFuncion = tabla.getFuncion(this.nombre);
        tabla.sizeActual.push(existeFuncion.size_function);
        tabla.ambito = true;
        let codigo = `proc ${this.nombre} begin\n`;
        this.instrucciones.map(m => {
            codigo += m.getC3D(tabla, arbol);
        });

        tabla.listaReturn.map(m => {
            codigo += `${m}:\n`
        });
        codigo += `end\n\n\n\n`
        tabla.ambito = false;
        tabla.listaReturn = [];
        tabla.sizeActual.pop();
        tabla.tempStorage = [];
        return codigo;
    }

    getArbol(arbol: String): String {
        return '';
    }
}