import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularEditorConfig, AngularEditorComponent } from '@kolkov/angular-editor';
import { tabs } from 'src/app/models/tabs';
import { saveAs, save } from 'file-saver';

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

  compilar(){

  }

  ejecutar(){

  }

  optimizar(){
    console.log('optimizar');
  }

  reporteTS(){

  }

  reporteAST(){

  }

  reporteOptimizacion(){

  }

}
