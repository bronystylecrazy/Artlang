import Position from "../lexer/Position";
import Token from "../lexer/Token";
import Node from "./NodeBase";

class StringNode extends Node {

    constructor(public token: Token, public value?: string){
        super();
        this.posStart = this.token.posStart;
        this.posEnd = this.token.posEnd;
    }

    toString(){
        return `"${this.token.toString()}"`;
    }
}

export default StringNode;