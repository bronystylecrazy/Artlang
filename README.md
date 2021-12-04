# Artlang
 Simple Artlang compiler to build simple UI

## Grammar rules
expr   : KEYWORD:let IDENTIFIER EQ expr
         arith_expr ((AND|OR) arith_expr)*

logic_expr : NOT logic_expr
            arith_expr ((EE|LT|GT|LTE|GTE) arith_expr)*

arith_expr : term ((PLUS|MINUS) term)*

term   : factor ((MUL|DIV) factor)*

factor : INT|FLOAT
        POWER

power  : function-invocation (POW factor)*

function-invocation   : atom (LPAREN (expr (COMMA expr)*)? RPAREN)?

atom   : (PLUS|MINUS|IDENTIFIER) factor
       : LPAREN expr RPAREN
       : if-expression
       : for-expression
       : while-expression
       : function-definition

if-expression : KEYWORD:if LPAREN expr RPAREN expr
                (KEYWORD:else if LPAREN expr RPAREN expr)*
                (KEYWORD:else expr)?

for-expression : KEYWORD:for LPAREN IDENTIFIER EQ expr RPAREN to expr

while-expression : KEYWORD:while LPAREN expr RPAREN expr

function-definition : KEYWORD:function IDENTIFIER?
                    LPAREN (IDENTIFIER (COMMA IDENTIFIER)*)? RPAREN
                    expr