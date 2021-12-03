import Position from "../Lexer/Position";
import Token from "../Lexer/Token";
import Node from "./NodeBase";

class StringNode extends Node {

    constructor(public token: Token, public value: number){
        super();
        this.posStart = this.token.posStart;
        this.posEnd = this.token.posEnd;
    }

    toString(){
        return `"${this.token.toString()}"`;
    }
}

export default StringNode;