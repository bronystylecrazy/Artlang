import Parser from "../parser/Parser";
import Lexer from "../lexer/Lexer";
import ProgramResult from "../result/ProgramResult";
import Interpreter from "./Interpreter";
import Context from "../context/Context";
import SymbolTable from "../context/SymbolTable";

const TOP_LEVEL_CONTEXT = Context.createContext('<vm>',null, null,new SymbolTable(null))

const Program = (source: string, { context = TOP_LEVEL_CONTEXT } = {}): ProgramResult => {
    
    const lexer = new Lexer(source,'<Program>');
    const lexerResult = lexer.build({ save: true});
    if(lexerResult.isError()) 
        return new ProgramResult(lexerResult.error);

    const parser = new Parser(lexerResult.tokens);
    const parseResult = parser.parse({});
    if(parseResult.isError()) return new ProgramResult(parseResult.error);

    const interpreter = new Interpreter();
    const globalContext = context;
    const runtimeResult = interpreter.visit(parseResult.node, globalContext);
    if(runtimeResult.error) {
        return new ProgramResult(runtimeResult.error);
    }

    return new ProgramResult(runtimeResult.value)
                .setTokens(lexerResult.tokens)
                .setAstNode(parseResult.node);
};

export default Program;