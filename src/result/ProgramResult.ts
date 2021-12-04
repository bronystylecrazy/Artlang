import Token from "../lexer/Token";
import Atomic from "../atomic/Atomic";
import Error from "../error/ErrorBase";
import Node from "../node/NodeBase";

class ProgramResult{
    public result: Atomic;
    public error: Error;
    public tokens: Token[];
    public astNode: Node;

    constructor(value?: Error|Atomic){
        if(value instanceof Error){
            this.error = value;
        }
        if(value instanceof Atomic){
            this.result = value;
        }
    }

    setTokens(tokens: Token[]){
        this.tokens = tokens;
        return this;
    }

    setAstNode(node: Node){
        this.astNode = node;
        return this;
    }

    isError(){
        return typeof this.error !== 'undefined' || this.error !== null;
    }
}

export default ProgramResult;