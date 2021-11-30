const { Error } = require('./src/Error');
const Lexer = require('./src/Lexer');
const Parser = require('./src/Parser');

console.clear();

let text = `(1 + 2 + 3)`;
let lexer = new Lexer(text, 'test.txt');
let tokens = lexer.makeTokens();
if(tokens == []) return;
let parser = new Parser(tokens);
let ast = parser.parse();
if(ast.error) 
    console.log(ast.error);
else{
    // console.log(ast.toString())
    console.log(ast.toString())
    require('fs').writeFileSync('ast.json', JSON.stringify(ast, null, 2));
}


// console.log(tokens)