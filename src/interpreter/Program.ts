import Parser from "../parser/Parser";
import Lexer from "../lexer/Lexer";
import ProgramResult from "../result/ProgramResult";
import Interpreter from "./Interpreter";
import Context from "../context/Context";
import SymbolTable from "../context/SymbolTable";
import String from "../atomic/String";
import Number from "../atomic/Number";
import Position from "../lexer/Position";

const GLOBAL_VARIABLES = new SymbolTable().of({
    world: new String("hello"),
    __dir__: new String(__dirname),
    __fileName__: new String(__filename),
    count: new Number(0)
});

let globalContext = Context.createContext('<vm>',null, new Position(), GLOBAL_VARIABLES);

const Program = (source: string): ProgramResult => {
    
    const lexer = new Lexer(source,'<Program>');
    const lexerResult = lexer.build({ save: true});
    if(lexerResult.isError()) 
        return new ProgramResult(lexerResult.error);

    const parser = new Parser(lexerResult.tokens);
    const parseResult = parser.parse({});
    if(parseResult.isError()) return new ProgramResult(parseResult.error);

    const interpreter = new Interpreter();
    const runtimeResult = interpreter.visit(parseResult.node, globalContext);
    if(runtimeResult.error) {
        return new ProgramResult(runtimeResult.error);
    }

    return new ProgramResult(runtimeResult.value)
                .setTokens(lexerResult.tokens)
                .setAstNode(parseResult.node);
};

export default Program;