import Token from "../lexer/Token";
import Node from "./NodeBase";

class UndefinedNode extends Node{
    value: string = "undefined";
    constructor(public token: Token){
        super();
        this.posStart = this.token.posStart;
        this.posEnd = this.token.posEnd;
    }

    toString(){
        return `undefined`;
    }
}

export default UndefinedNode;