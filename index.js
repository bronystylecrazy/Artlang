const { Error } = require('./src/Error');
const Lexer = require('./src/Lexer');
const { Parser } = require('./src/Parser');
const { Interpreter } = require('./src/Interpreter');
const { ParseResult } = require('./src/Result');
const { Context } = require('./src/Context');
console.clear();
const sourceCode = require('fs').readFileSync('./test.alg', 'utf8');
let text = sourceCode;
/** Generate tokens */
let lexer = new Lexer(text, 'test.txt');
let tokens = lexer.makeTokens();
if(tokens == []) return;

/** Generate AST */
let parser = new Parser(tokens);
let ast = parser.parse();
if (ast.error ) return console.log(ast.error);


require('fs').writeFileSync('ast.json', JSON.stringify(ast.node, null, 2));

    // console.log(ast.toString())
/** AST Preview */
console.log(ast.toString())

/** RUN PROGRAM */
let result = new Interpreter(ast);
let context  = Context.createContext('<module>');
const r = result.visit(ast.node, context);
if(r.error) return console.log(r.error);
else console.log('Final Result: ', r.value.toString())
