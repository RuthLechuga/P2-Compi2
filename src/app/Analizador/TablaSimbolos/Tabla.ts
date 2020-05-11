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
    
    getTotalTemporales(): number {
        return this.temporal;
    }

    getFuncionesNativas(): string{

        let c3d = '';

        c3d += this.potencia();

        return c3d;
    }

    potencia(): string{
        let c3d = '';

        c3d = '\nproc POTENCIA201602975_integer_integer begin\n';
        let t1 = this.getTemporal();
        let a = this.getTemporal();
        let t2 = this.getTemporal();
        let b = this.getTemporal();
        let cont = this.getTemporal();
        let acumulador = this.getTemporal();
        let etc = this.getEtiqueta();
        let ets = this.getEtiqueta();

        c3d += `${t1} = P;\n`;
        c3d += `${t1} = ${t1}+1;\n`;
        c3d += `${a} = stack[${t1}];\n`;
        
        c3d += `${t2} = P;\n`;
        c3d += `${t2} = ${t2}+2;\n`;
        c3d += `${b} = stack[${t2}];\n`;
        
        c3d += `${cont} = 1;\n`;
        c3d += `${acumulador} = ${a};\n`;

        c3d += `${etc}:\n`;
        
        c3d += `if(${cont}==${b}) goto ${ets};\n`;
        
        c3d += `${acumulador} = ${acumulador} * ${a};\n`;
        c3d += `${cont} = ${cont} + 1;\n`;
        c3d += `goto ${etc};\n\n`;

        c3d += `${ets}:\n`
        
        c3d += `stack[P] = ${acumulador};\n`

        c3d += 'end\n\n';
        return c3d;
    }
}