import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { tabs } from 'src/app/models/tabs';
import { saveAs } from 'file-saver';
import { Tabla } from '../../Analizador/TablaSimbolos/Tabla';
import { Arbol } from "../../Analizador/TablaSimbolos/Arbol";
import { agregarFuncion, getFuncionSize } from "../../Analizador/Utils/Common";
import { Declaracion } from "../../Analizador/Instrucciones/Declaracion";
import { Funcion } from "../../Analizador/Instrucciones/Funcion";
import { Simbolo } from 'src/app/Analizador/TablaSimbolos/Simbolo';
import { Error } from '../../Analizador/Excepcion/Error';
const parser = require('../../Analizador/Gramatica/gramatica.js');


@Component({
  selector: 'app-ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.css']
})
export class IDEComponent implements OnInit {

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: '350px',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  tabs: tabs[] = [];

  linea = 1;
  columna = 1;
  entrada:string = '';
  contTabs = 1;
  tabActual = "Pestaña #1";
  tablaSimbolos: Tabla;
  variables: Array<Simbolo>;
  errores: Array<Error>;

  constructor() { }

  ngOnInit(): void {
    this.addTab();
  }

  //-------------------------------METODOS DE INTERACCION CON INTERFAZ GRAFICA----------------------------------------//
  cambioTab(event){
    const tab = this.tabs.find(tab => tab.nombre==this.tabActual)
    tab.entrada = this.entrada;

    this.tabActual = event.target.text;
    const tabN = this.tabs.find(tab => tab.nombre==this.tabActual)
    this.entrada = tabN.entrada;
  }

  abrir(fileList: FileList){
    let file = fileList[0];
    let fileReader: FileReader = new FileReader();
    let self = this;
    fileReader.onloadend = function(x) {
      self.entrada = <string>fileReader.result;
    }
    fileReader.readAsText(file);
  }

  addTab(){
    this.tabs.push({nombre: 'Pestaña #'+this.contTabs, entrada: ''})
    this.contTabs++;
  }

  guardar(){
    this.guardarComo();
  }

  guardarComo(){
    let file = new Blob([this.entrada], { type: 'text/csv;charset=utf-8' });
    saveAs(file, 'entrada.txt')
  }

  traducir(){ 
    let entrada = this.entrada.replace(new RegExp('<div>','g'),'\n');
    entrada = entrada.replace(new RegExp('</div>','g'),'');
    entrada = entrada.replace(new RegExp('&#34;','g'),'\"');
    entrada = entrada.replace(new RegExp('<br>','g'),' ');
    entrada = entrada.replace(new RegExp('<span>','g'),' ');
    entrada = entrada.replace(new RegExp('&gt;','g'),'>');
    entrada = entrada.replace(new RegExp('&#160;','g'),'');

    console.log(entrada)

    if (!entrada || !entrada || /^\s*$/.test(entrada)) {
      console.log('Error :(');
    }
    const arbol: Arbol = parser.parse(entrada);
    if (arbol.errores.length === 0) {
        const tabla = new Tabla();
        tabla.sizeActual.push(0);
        // Obteniendo funciones
        console.log(arbol.instrucciones);
        arbol.instrucciones.map(m => {
            if (m instanceof Funcion) {
                tabla.setStack(0);
                agregarFuncion(tabla, arbol, m);
            }
        });

        let cantidadGlobales = 0;
        arbol.instrucciones.map(m => {
            if (m instanceof Declaracion) {
                m.posicion = tabla.getHeap();
                cantidadGlobales++;
            }
        });

        arbol.instrucciones.map(m => {
            m.analizar(tabla, arbol);
        });

        let c3d = '';
        if (arbol.errores.length == 0) {
            for (let i = 0; i < cantidadGlobales; i++) {
                c3d += `heap[${i}] = 0;\n`;
                c3d += `h = h + 1;\n`
            }

            arbol.instrucciones.map(m => {
                c3d += m.getC3D(tabla, arbol);
            });
        }

        c3d = this.getEncabezado(tabla,c3d);

        let tc3d = c3d.replace(new RegExp('\n','g'),'<div></div>');
        this.tabs.push({nombre: 'Pestaña #'+this.contTabs, entrada: tc3d})
        this.contTabs++;

        console.log("CODIGO 3D\n",c3d);
        console.log("Variables\n",tabla.variables);
        console.log("Funciones\n",tabla.funciones);
        console.log("Errores\n",arbol.errores);
        this.tablaSimbolos = tabla;
        this.variables = this.tablaSimbolos.variables;
        this.errores = arbol.errores;

    } else {
        console.log(arbol.errores);
    }

  }

  getEncabezado(tabla: Tabla, c3d: string): string{

    let total = tabla.getTotalTemporales();

    let encabezado = "var ";

    for(let i=1;i<=total;i++)
      encabezado += "t"+i+",";
    
    encabezado = encabezado.substring(0,encabezado.length-1);
    encabezado += ";\n";
    encabezado += "var Stack[];\n";
    encabezado += "var Heap[];\n";
    encabezado += "var P=0;\n";
    encabezado += "var H=0;\n";

    encabezado += "call principal;\n";
    
    let et = tabla.getEtiqueta();
    encabezado += "goto "+et+";\n";

    c3d = encabezado+c3d;

    c3d = c3d+"\n"+et+":\n";

    return c3d;
  }

  optimizar(){
  }

  reporteAST(){
    
  }

  reporteOptimizacion(){
  }

}
