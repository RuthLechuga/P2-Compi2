import { Node } from "../Abstract/Node";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Error } from "../Excepcion/Error";

export class Return extends Node {
    valor: Node;
    constructor(valor:Node, fila: number, columna: number) {
        super(null, fila, columna);
        this.valor = valor;
    }

    analizar(tabla: Tabla, arbol: Arbol): any {
        this.tipo  = this.valor.analizar(tabla, arbol);
        return this.tipo;
    }

    getC3D(tabla: Tabla, arbol: Arbol): String {
        let codigo = '';
        codigo += this.valor.getC3D(tabla, arbol);
        const etiqueta = tabla.getEtiqueta();
        codigo += `stack[P] = ${tabla.getTemporalActual()};\n`
        codigo += `goto ${etiqueta};\n`;
        tabla.listaReturn.push(etiqueta);
        return codigo;
    }

    getArbol(arbol: String): String {
        return '';
    }
}