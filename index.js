const Lexer = require('./src/Lexer');
const Parser = require('./src/Parser');

console.clear();

let text = `1 + 3 + 9*5 + 7`;
let lexer = new Lexer(text, 'test.txt');
let tokens = lexer.makeTokens();
if(tokens == []) return;
let parser = new Parser(tokens);
let ast = parser.parse();
console.log(ast.toString());


// console.log(tokens)