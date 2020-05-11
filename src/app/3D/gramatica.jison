%lex

%options case-insensitive

%%
"#".*										// comentario simple línea
[#][*][^*]*[*]+([^/*][^*]*[*]+)*[#]			// comentario multiple líneas

"var"               return 'RVAR';
"stack"             return 'RSTACK';
"heap"              return 'RHEAP';
"goto"              return 'RGOTO';
"begin"             return 'RBEGIN';
"end"               return 'REND';
"call"              return 'RCALL';
"print"             return 'RPRINT';
"if"                return 'RIF';
"proc"              return 'RPROC';
"begin"             return 'RBEGIN';
"end"               return 'REND';
"+"                 return 'MAS';
"-"                 return 'MENOS';
"*"                 return 'POR';
"/"                 return 'DIV';
"%"                 return 'MODULO';
">"                 return 'MAYOR_QUE';
"<"                 return 'MENOR_QUE';
">="                return 'MAYOR_IGUAL_QUE';
"<="                return 'MENOR_IGUAL_QUE';
"=="                return 'IGUAL_QUE';
"<>"                return 'DISTINTO_QUE';
";"                 return 'PTCOMA';
","                 return 'COMA';
"["                 return 'CIZQ';
"]"                 return 'CDER';
"("                 return 'PIZQ';
")"                 return 'PDER';
"="                 return 'ASIG';
":"                 return 'DPUNTOS';

/* Espacios en blanco */
[ \r\t]+            {}
\n                  {}

[0-9]+("."[0-9]+)?\b    return 'DECIMAL';
[0-9]+\b                return 'ENTERO';
"t"[0-9]+\b             return 'TEMPORAL';
"l"[0-9]+\b             return 'ETIQUETA';
([a-zA-Z])[a-zA-Z0-9_]*	return 'IDENTIFICADOR';

<<EOF>>                 return 'EOF';

.                       { console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }
/lex

/* Asociación de operadores y precedencia */

%left 'IGUAL_QUE' 'DISTINTO_QUE'
%left 'MENOR_QUE' 'MAYOR_QUE' 'MENOR_IGUAL_QUE' 'MAYOR_IGUAL_QUE'
%left 'MAS' 'MENOS'
%left 'POR' 'DIVIDIDO' 'MODULO'
%right 'POTENCIA'
%right UMENOS

%start ini

%% /* Definición de la gramática */

ini
	: instrucciones EOF
;

instrucciones
	: instruccion instrucciones
	| instruccion
	| error { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
;

instruccion 
    : RPRINT {console.log('Hola Mundo')}
;