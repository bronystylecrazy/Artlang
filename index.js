const { Error } = require('./src/Error');
const { Lexer } = require('./src/Lexer');
const { Parser } = require('./src/Parser');
const { Interpreter } = require('./src/Interpreter');
const { ParseResult } = require('./src/Result');
const { Context } = require('./src/Context');
console.clear();
// const sourceCode = require('fs').readFileSync('./test.js', 'utf8');

const globalSymbols = {};
let context  = Context.createContext('<module>');
context.symbols = globalSymbols;

function shell(sourceCode)
{
    let text = sourceCode;
    /** Generate tokens */
    let lexer = new Lexer(text, 'test.txt');
    let tokens = lexer.makeTokens();
    if(!tokens){
        return;
    }
    /** Generate AST */
    let parser = new Parser(tokens);
    let ast = parser.parse();
    require('fs').writeFileSync('./ast.json', JSON.stringify(ast, null, 2));
    if (ast.error ) return console.log(ast.error);

        // console.log(ast.toString())
    /** AST Preview */
    // console.log(ast)

    /** RUN PROGRAM */
    
    let result = new Interpreter(ast);
   
    const r = result.visit(ast.node, context);
    if(r.error) return console.log(r.error.toString());
    return r.value.toString();
}

// console.log(shell('hello'))

const readlineSync = require('readline-sync');
while(true){
    var sourceCode = readlineSync.question('>').trim();
    if(sourceCode === '') continue;
    console.log(shell(sourceCode));
}