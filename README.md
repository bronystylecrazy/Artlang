# Artlang
 Simple Artlang compiler to build simple UI

## Grammar rules
expr   : KEYWORD:let IDENTIFIER EQ expr
         term ((PLUS|MINUS) term)*

term   : factor ((MUL|DIV) factor)*

factor : INT|FLOAT
        POWER

power  : atom (POW factor)*
atomic   (PLUS|MINUS|IDENTIFIER) factor
         LPAREN expr RPAREN