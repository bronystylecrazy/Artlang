# Artlang
 Simple Artlang compiler to build simple UI

## Grammar rules
expr   : term ((PLUS|MINUS) term)*

term   : factor ((MUL|DIV) factor)*

factor : INT|FLOAT
         (PLUS|MINUS) factor