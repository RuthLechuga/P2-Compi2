import { Node } from "../Abstract/Node";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Error } from "../Excepcion/Error";

export class HacerMientras extends Node {
    
    condicion: Node;
    instrucciones: Array<Node>;
    constructor(condicion: Node, instrucciones: Array<Node>, fila: number, columna: number) {
        super(null, fila, columna);
        this.condicion = condicion;
        this.instrucciones = instrucciones;
    }

    analizar(tabla: Tabla, arbol: Arbol): any {
        let cond = this.condicion.analizar(tabla, arbol);
        if (cond instanceof Error) {
            return cond;
        }

        this.instrucciones.map(m => {
            let result = m.analizar(tabla, arbol);
            if (result instanceof Error) {
                return result;
            }
        });
    }

    getC3D(tabla: Tabla, arbol: Arbol): String {
        let codigo = '';
        
        let etiqueta = tabla.getEtiqueta();
        
        codigo += `${etiqueta}:\n`;
        this.instrucciones.map(m => {
            codigo += m.getC3D(tabla, arbol);
        });
        
        codigo += this.condicion.getC3D(tabla, arbol);
        let temp = tabla.getTemporalActual();
        codigo += `if(${temp} == 1) goto ${etiqueta}\n`
        return codigo;
    }

    getArbol(arbol: String): String {
        return '';
    }

}