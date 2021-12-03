import Position from "../Lexer/Position";
import Token from "../Lexer/Token";
import Node from "./NodeBase";

class BinaryOperatorNode extends Node{

    constructor(public left: Token, public operator: Token, public right: Token){
        super();
        this.posStart = this.left.posStart;
        this.posEnd = this.right.posEnd;
    }

    toString(){
        return `(${this.left},${this.operator},${this.right})`;
    }
}

export default BinaryOperatorNode;