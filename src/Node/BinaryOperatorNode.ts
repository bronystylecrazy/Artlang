import Position from "../lexer/Position";
import Token from "../lexer/Token";
import Node from "./NodeBase";

class BinaryOperatorNode extends Node{

    constructor(public left: Node, public operator: Token, public right: Node){
        super();
        this.posStart = this.left.posStart;
        this.posEnd = this.right.posEnd;
    }

    toString(){
        return `(${this.left},${this.operator},${this.right})`;
    }
}

export default BinaryOperatorNode;