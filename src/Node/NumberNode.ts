import Position from "../lexer/Position";
import Token from "../lexer/Token";
import Node from "./NodeBase";

class NumberNode extends Node{

    constructor(public token: Token, public value?: number){
        super();
        this.value = token.value;
        this.posStart = this.token.posStart;
        this.posEnd = this.token.posEnd;
    }

    toString(){
        return `${this.value.toString()}`;
    }
}

export default NumberNode;