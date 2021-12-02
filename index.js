const { Lexer } = require('./src/Lexer');
const { Parser } = require('./src/Parser');
const { Interpreter } = require('./src/Interpreter');
const colors = require('colors');
const { Context } = require('./src/Context');
console.clear();
// const sourceCode = require('fs').readFileSync('./test.js', 'utf8');

const globalSymbols = {};
let context  = Context.createContext('<module>');
context.symbols = globalSymbols;


function shell(sourceCode)
{
    /** Generate tokens */

    let lexer = new Lexer(sourceCode, '<vm>');
    let [tokens, error] = lexer.makeTokens({ save: true});

    if(error)
    {
        console.log(error);
        return;
    }

    /** Generate AST ParseResult */
    let parser = new Parser(tokens);
    let ast = parser.parse({ save: true });

    if (ast.error){
        console.log(ast.error.toString());
        return;
    }

    /** Interpret */
    let interpreter = new Interpreter(ast);
    let result = interpreter.visit(ast.node, context);

    if(result.error){
        console.log(result.error.toString());
        return;
    }

    /** Show the value */
    console.log((result.value.toString()+'').gray);
}


const readlineSync = require('readline-sync');

while(true){
    var sourceCode = readlineSync.question('>').trim();
    if(sourceCode != '') shell(sourceCode);
}