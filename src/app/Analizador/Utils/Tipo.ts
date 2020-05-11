export enum Types {
    INTEGER,
    STRING,
    BOOLEAN,
    VOID,
    DOUBLE,
    CHAR,
    STRUCT
}

export class Tipo {
    tipo: Types;
    tipoExplicito: String;
    tipoObjeto: string;
    dimensiones: Number;
    
    constructor(tipo: Types, dimensiones: Number = 0) {
        this.tipo = tipo;
        this.dimensiones = dimensiones;
        this.tipoExplicito = this.toString();
    }

    setTipoObjeto(tipoObjeto: string){
        this.tipoObjeto = tipoObjeto;
    }

    toString() {
        if (this.dimensiones == 0) {
            return (Types[this.tipo]).toLowerCase()
        } else {
            return ('arreglo_' + Types[this.tipo]).toLowerCase();
        }
    }
}