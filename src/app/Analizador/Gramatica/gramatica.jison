
%{
    const {Primitivo} = require('../Expresiones/Primitivo');
    const {OperacionAritmetica} = require('../Expresiones/OperacionAritmetica');
    const {OperacionRelacional} = require('../Expresiones/OperacionRelacional');
    const {Identificador} = require('../Expresiones/Identificador');
    const {Caracter} = require('../Expresiones/Caracter');
    const {Cadena} = require('../Expresiones/Cadena');
    const {Arreglo} = require('../Expresiones/Arreglo');
    const {Llamada} = require('../Expresiones/Llamada');
    const {Return} = require('../Expresiones/Return');
    const {Print} = require('../Instrucciones/Print');
    const {Si} = require('../Instrucciones/Si');
    const {Funcion} = require('../Instrucciones/Funcion');
    const {Mientras} = require('../Instrucciones/Mientras');
    const {HacerMientras} = require('../Instrucciones/HacerMientras');
    const {Declaracion} = require('../Instrucciones/Declaracion');
    const {Importar} = require('../Instrucciones/Import');
    const {Asignacion} = require('../Instrucciones/Asignacion');
    const {Errr} = require('../Excepcion/Error');
    const {Tipo, Types} = require('../utils/Tipo');
    const {Arbol} = require('../TablaSimbolos/Arbol');
    const {Visibilidad} = require('../Utils/Common');
%}

%lex
%options case-insensitive
entero [0-9]+
decimal {entero}"."{entero}
identificador [a-zA-Z]([a-zA-Z]|[0-9])*
archivo [a-zA-Z]([a-zA-Z]|[0-9]|'.')*('.j')
escapechar [\'\"\\bfnrtv]
escape \\{escapechar}
acceptedquote [^\"\\]+
stringliteral (\"({escape}|{acceptedquote})*\")
charliteral (\'({escape}|{acceptedquote})\')
%%

\s+                   /* skip whitespace */
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

{decimal}             return 'DECIMAL'
{entero}              return 'ENTERO'
{stringliteral}       return 'STRING_LITERAL'
{charliteral}         return 'CHAR_LITERAL'
"*"                   return '*'
"/"                   return '/'
";"                   return 'PUNTOCOMA'
"-"                   return '-'
"+"                   return '+'
"%"                   return '%'
"^^"                  return '^^'
"^"                   return '^'
"||"                  return '||'
"&&"                  return '&&'
"!"                   return '!'
"<"                   return '<'
">"                   return '>'
"<="                  return '<='
">="                  return '>='
"==="                 return '==='
"=="                  return '=='
"!="                  return '!='
"="                   return '='
":="                  return ':='
"("                   return '('
")"                   return ')'  
"["                   return '['
"]"                   return ']'
"}"                   return 'LLDER'
"{"                   return 'LLIZQ'
","                   return ','
"integer"             return 'integer'
"double"              return 'double'
"char"                return 'char'
"boolean"             return 'boolean'
"true"                return 'TRUE'
"false"               return 'FALSE'
"import"              return 'import'
"print"               return 'print'
"var"                 return 'var'
"const"               return 'const'
"global"              return 'global'
"void"                return 'void'
"public"              return 'public'
"private"             return 'private'
"return"              return 'return'

{archivo}             return 'archivo'
{identificador}       return 'identificador'
<<EOF>>				  return 'EOF'

/lex

%left 'else'
%left '||'
%left '&&'
%left '^'
%left '==' '!=' '==='
%left '<' '>' '<=' '>='
%left '+' '-' '%'
%left '*' '/'
%left '^^'
%left UMENOS, '!'
%left '(' ')'

%start INICIO

%%

INICIO : INSTRUCCIONES_GLOBALES EOF {return new Arbol($$);}
;

//------------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------INSTRUCCIONES GLOBALES-------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------//

INSTRUCCIONES_GLOBALES : INSTRUCCIONES_GLOBALES INSTRUCCION_GLOBAL            { $$ = $1; Array.prototype.push.apply($$,$2); }
            | INSTRUCCION_GLOBAL                                              { $$ = $1; }
        ;

INSTRUCCION_GLOBAL : IMPORTS                                                    { $$ = $1; }
        | DECLARACION PUNTOCOMA                                                 { $$ = $1; }
        | DECLARACION                                                           { $$ = $1; }
        | METODO                                                                { $$ = [$1]; }
        ;

//-------------------------------------------------IMPORTACIONES-------------------------------------------------//
IMPORTS : 'import' ARCHIVOS PUNTOCOMA                                           {
                                                                                    $$ = [];
                                                                                    $2.map(url => {
                                                                                        $$.push(new Importar(url,this._$.first_line, this._$.first_column));
                                                                                    });
                                                                                }      
        | 'import' ARCHIVOS                                                     {
                                                                                    $$ = [];
                                                                                    $2.map(url => {
                                                                                        $$.push(new Importar(url,this._$.first_line, this._$.first_column));
                                                                                    });
                                                                                } 
        ;
    
ARCHIVOS : ARCHIVOS ',' archivo                                                 {   
                                                                                    $$ = $1; 
                                                                                    $$.push($3);
                                                                                }
        | archivo                                                               { $$ = [$1]; }
        ;

//---------------------------------------------------FUNCIONES---------------------------------------------------//

METODO : VISIBILIDAD TIPO identificador '(' LISTA_PARAMETROS ')' LLIZQ INSTRUCCIONES LLDER          { $$ = new Funcion($1, $2, $3, $5, $8, this._$.first_line, this._$.first_column); }
        | TIPO identificador '(' LISTA_PARAMETROS ')' LLIZQ INSTRUCCIONES LLDER                     { $$ = new Funcion(null, $2, $3, $5, $7, this._$.first_line, this._$.first_column); }
        | VISIBILIDAD TIPO identificador '(' ')' LLIZQ INSTRUCCIONES LLDER                          { $$ = new Funcion($1, $2, $3, [], $7, this._$.first_line, this._$.first_column); }
        | TIPO identificador '(' ')' LLIZQ INSTRUCCIONES LLDER                                      { $$ = new Funcion(null, $2, $3, [], $7, this._$.first_line, this._$.first_column); }
        ;

VISIBILIDAD : 'private'     { $$ = Visibilidad.PRIVATE; }
        | 'public'          { $$ = Visibilidad.PUBLIC; }
        ;

LISTA_PARAMETROS : LISTA_PARAMETROS ',' PARAMETRO       { 
                                                            $$ = $1; 
                                                            $$.push($3); 
                                                        }
        | PARAMETRO                                     { $$ = [$1]; }
        ;

PARAMETRO : TIPO identificador          { $$ = new Declaracion($1, $2, null, false, false, this._$.first_line, this._$.first_column); }
        ;

//-------------------------------------------------DECLARACIONES-------------------------------------------------//
DECLARACION : TIPO ID_LISTA '=' EXPRESION                   {
                                                                $$ = [];
                                                                $2.map(id => {
                                                                    $$.push(new Declaracion($1,id,$4,false,false,this._$.first_line, this._$.first_column));
                                                                });
                                                            }          
        | 'var' identificador ':=' EXPRESION                {
                                                                $$ = [];
                                                                $$.push(new Declaracion(null,$2,$4,false,false,this._$.first_line, this._$.first_column));
                                                            }
        | 'const' identificador ':=' EXPRESION              {
                                                                $$ = [];
                                                                $$.push(new Declaracion(null,$2,$4,true,false,this._$.first_line, this._$.first_column));
                                                            }
        | 'global' identificador ':=' EXPRESION             {
                                                                $$ = [];
                                                                $$.push(new Declaracion(null,$2,$4,false,true,this._$.first_line, this._$.first_column));
                                                            }
        | TIPO ID_LISTA                                     {
                                                                $$ = [];
                                                                $2.map(id => {
                                                                    $$.push(new Declaracion($1,id,null,false,false,this._$.first_line, this._$.first_column));
                                                                });
                                                            }                       
        ;

TIPO : 'integer'            { $$ = new Tipo(Types.INTEGER); }
        | 'double'          { $$ = new Tipo(Types.DOUBLE); }
        | 'char'            { $$ = new Tipo(Types.CHAR); }
        | 'boolean'         { $$ = new Tipo(Types.BOOLEAN); }
        | 'void'            { $$ = new Tipo(Types.VOID); }
        | identificador     {
                                $$ = new Tipo(Types.STRUCT); 
                                $$.setTipoObjeto($1); 
                            }
        ;

ID_LISTA : ID_LISTA ',' identificador       {   
                                                $$ = $1; 
                                                $$.push($3);
                                            }
        | identificador                     { $$ = [$1]; }
        ;

//------------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------INSTRUCCIONES LOCALES-------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------//

INSTRUCCIONES : INSTRUCCIONES INSTRUCCION   { $$ = $1; Array.prototype.push.apply($$,$2); }
              | INSTRUCCION                 { $$ = $1; }
              ;

INSTRUCCION : PRINT                         { $$ = [$1]; }
            | DECLARACION PUNTOCOMA         { $$ = $1; }
            | DECLARACION                   { $$ = $1; }
            | LLAMADA PUNTOCOMA             { $$ = [$1]; }
            | LLAMADA                       { $$ = [$1]; }
            | RETURN                        { $$ = [$1]; }
            | ASIGNACION                    { $$ = [$1]; }
            ;
            
PRINT : 'print' '(' EXPRESION ')' PUNTOCOMA     { $$ = new Print($3); }
        | 'print' '(' EXPRESION ')'             { $$ = new Print($3); }
        ;

LLAMADA : identificador '(' LISTA_EXPRESION ')'                     { $$ = new Llamada($1, $3, this._$.first_line, this._$.first_column); }
        | identificador '(' ')'                                     { $$ = new Llamada($1, [], this._$.first_line, this._$.first_column); }
        ;

LISTA_EXPRESION : LISTA_EXPRESION ',' EXPRESION     { 
                                                        $$ = $1;
                                                        $$.push($3);
                                                    }
        | EXPRESION                                 { $$ = [$1]; }
        ;

RETURN : 'return' EXPRESION PUNTOCOMA               { $$ = new Return($2); }
        | 'return' EXPRESION                        { $$ = new Return($2); }
        ;

ASIGNACION : identificador '=' EXPRESION PUNTOCOMA                      { $$ = new Asignacion($1, $3, this._$.first_line, this._$.first_column); }
        | identificador '=' EXPRESION                                   { $$ = new Asignacion($1, $3, this._$.first_line, this._$.first_column); }
        | identificador '[' EXPRESION ']' '=' EXPRESION PUNTOCOMA       {}
        | identificador '[' EXPRESION ']' '=' EXPRESION                 {}
        ;

//--------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------EXPRESIONES-------------------------------------------------//
//--------------------------------------------------------------------------------------------------------------//

EXPRESION : '-' EXPRESION %prec UMENOS	    { $$ = new OperacionAritmetica($2, undefined, '-', this._$.first_line, this._$.first_column); }
          | '!' EXPRESION                   { $$ = new OperacionAritmetica($1, undefined, '!', this._$.first_line, this._$.first_column); }
          | EXPRESION '+' EXPRESION		    { $$ = new OperacionAritmetica($1, $3, '+', this._$.first_line, this._$.first_column); }
          | EXPRESION '-' EXPRESION		    { $$ = new OperacionAritmetica($1, $3, '-', this._$.first_line, this._$.first_column); }
          | EXPRESION '%' EXPRESION	        { $$ = new OperacionAritmetica($1, $3, '%', this._$.first_line, this._$.first_column); }
          | EXPRESION '^^' EXPRESION	    { $$ = new OperacionAritmetica($1, $3, '^^', this._$.first_line, this._$.first_column); }
          | EXPRESION '*' EXPRESION		    { $$ = new OperacionAritmetica($1, $3, '*', this._$.first_line, this._$.first_column); }
          | EXPRESION '/' EXPRESION	        { $$ = new OperacionAritmetica($1, $3, '/', this._$.first_line, this._$.first_column); }
          | EXPRESION '<' EXPRESION		    { $$ = new OperacionRelacional($1, $3, '<', this._$.first_line, this._$.first_column); }
          | EXPRESION '>' EXPRESION		    { $$ = new OperacionRelacional($1, $3, '>', this._$.first_line, this._$.first_column); }
          | EXPRESION '<=' EXPRESION	    { $$ = new OperacionRelacional($1, $3, '<=', this._$.first_line, this._$.first_column); }
          | EXPRESION '>=' EXPRESION	    { $$ = new OperacionRelacional($1, $3, '>=', this._$.first_line, this._$.first_column); }
          | EXPRESION '==' EXPRESION	    { $$ = new OperacionRelacional($1, $3, '==', this._$.first_line, this._$.first_column); }
          | EXPRESION '!=' EXPRESION	    { $$ = new OperacionRelacional($1, $3, '!=', this._$.first_line, this._$.first_column); }
          | EXPRESION '&&' EXPRESION	    { $$ = new OperacionRelacional($1, $3, '&&', this._$.first_line, this._$.first_column); }
          | EXPRESION '||' EXPRESION	    { $$ = new OperacionRelacional($1, $3, '||', this._$.first_line, this._$.first_column); }
          | EXPRESION '^' EXPRESION	        { $$ = new OperacionRelacional($1, $3, '^', this._$.first_line, this._$.first_column); }
          | identificador                   { $$ = new Identificador($1, this._$.first_line, this._$.first_column); }
          | ARREGLO				            { $$ = $1; } 
          | LLAMADA				            { $$ = $1; } 
          | ENTERO				            { $$ = new Primitivo(new Tipo(Types.INTEGER), $1, this._$.first_line, this._$.first_column); } 
          | DECIMAL				            { $$ = new Primitivo(new Tipo(Types.INTEGER), $1, this._$.first_line, this._$.first_column); }
          | verdadero				        { $$ = new Primitivo(new Tipo(Types.BOOLEAN), 1, this._$.first_line, this._$.first_column); }
          | falso	     				    { $$ = new Primitivo(new Tipo(Types.BOOLEAN), 0, this._$.first_line, this._$.first_column); }
          | STRING_LITERAL                  { $1 = $1.slice(1, $1.length-1); $$ = new Cadena($1, new Arreglo(new Tipo(Types.STRING), [new Primitivo(new Tipo(Types.INTEGER), $1.length, this._$.first_line, this._$.first_column)], this._$.first_line, this._$.first_column), this._$.first_line, this._$.first_column); }  
          | '(' EXPRESION ')'		        { $$ = $2; }
          ;

