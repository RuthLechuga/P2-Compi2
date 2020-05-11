export class Error {

    tipo: String;
    descripcion: String;
    fila: Number;
    columna: Number;

    constructor(tipo: String, descripcion: String, fila: Number, columna: Number) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.fila = fila;
        this.columna = columna;
    }

    toString(){
        return `${this.tipo} ${this.descripcion} ${this.fila} ${this.columna}`;
    }
}