%lex

%options case-insensitive

%%
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

"Evaluar"           return 'REVALUAR';
"null"				return 'RNULL';
"import"			return 'RIMPORT';
"true"				return 'RTRUE';
"switch"			return 'RSWITCH';
"continue"			return 'RCONTINUE';
"private"			return 'RPRIVATE';
"define"			return 'RDEFINE';
"try"				return 'RTRY';
"integer"			return "RINTEGER";
"var"				return 'RVAR';
"false"				return 'RFALSE';
"case"				return 'RCASE';
"return"			return 'RRETURN';
"void"				return 'RVOID';
"as"				return 'RAS';
"catch"				return 'RCATCH';
"double"			return 'RDOUBLE';
"const"				return 'RCONST';
"if"				return 'RIF';
"default"			return 'RDEFAULT';
"print"				return 'RPRINT';
"for"				return 'RFOR';
"strc"				return 'RSTRC';
"throw"				return 'RTHROW';
"char"				return 'RCHAR';
"global"			return 'RGLOBAL';
"else"				return 'RELSE';
"break"				return 'RBREAK';
"public"			return 'RPUBLIC';
"while"				return 'RWHILE';
"do"				return 'RDO';
"{"					return 'LLIZQ';
"}"					return 'LLDER';
"^^"				return 'POTENCIA';
"::="				return 'ASIG1';
"==="				return 'IGUAL_QUE_REFERENCIA'
"=="				return 'IGUAL_QUE';
"!="				return 'DISTINTO_QUE';
"<"					return 'MENOR_QUE';
">"					return 'MAYOR_QUE';
"<="				return 'MENOR_IGUAL_QUE';
">="				return 'MAYOR_IGUAL_QUE';
"&&"				return 'AND';
"||"				return 'OR';
"!"					return 'NOT';
"^"					return 'XOR';
"++"				return 'INC';
"--"				return 'DEC';
"="					return 'ASIG2';
"("                 return 'PIZQ';
")"                 return 'PDER';
"["                 return 'CIZQ';
"]"                 return 'CDER';
";"                 return 'PTCOMA';
"+"                 return 'MAS';
"-"                 return 'MENOS';
"*"                 return 'POR';
"/"                 return 'DIVIDIDO';
"%"					return 'MODULO';
"ArithmeticException"			return 'ArithmeticException';
"IndexOutOfBoundException"		return 'IndexOutOfBoundException';
"UncaughtException"				return 'UncaughtException';
"NullPointerException"			return 'NullPointerException';
"InvalidCastingException"		return 'InvalidCastingException';
"HeapOverflowError"				return 'HeapOverflowError';
"StackOverflowError"			return 'StackOverflowError';

/* Espacios en blanco */
[ \r\t]+            {}
\n                  {}

[0-9]+("."[0-9]+)?\b    return 'DECIMAL';
[0-9]+\b                return 'ENTERO';
([a-zA-Z])[a-zA-Z0-9_]*	return 'IDENTIFICADOR';
\'[^\"]\'				{ yytext = yytext.substr(1,yyleng-2); return 'CARACTER'; }

<<EOF>>                 return 'EOF';

.                       { console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }
/lex

/* Asociación de operadores y precedencia */

%left 'ASIG1' 'ASIG2'
%left 'INC' 'DEC'
%left 'XOR'
%left 'OR'
%left 'AND'
%left 'IGUAL_QUE' 'IGUAL_QUE_REFERENCIA' 'DISTINTO_QUE'
%left 'MENOR_QUE' 'MAYOR_QUE' 'MENOR_IGUAL_QUE' 'MAYOR_IGUAL_QUE'
%left 'MAS' 'MENOS'
%left 'POR' 'DIVIDIDO' 'MODULO'
%right 'POTENCIA'
%right UMENOS
%right 'NOT'

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
	: REVALUAR CIZQ expresion CDER PTCOMA {
		console.log('El valor de la expresión es: ' + $3);
	}
;

expresion
	: MENOS expresion %prec UMENOS  { $$ = $2 *-1; }
	| expresion MAS expresion       { $$ = $1 + $3; }
	| expresion MENOS expresion     { $$ = $1 - $3; }
	| expresion POR expresion       { $$ = $1 * $3; }
	| expresion DIVIDIDO expresion  { $$ = $1 / $3; }
	| ENTERO                        { $$ = Number($1); }
	| DECIMAL                       { $$ = Number($1); }
	| PIZQ expresion PDER       	{ $$ = $2; }
;