import Position from "../lexer/Position";
import Token from "../lexer/Token";
import Node from "./NodeBase";

class UnaryOperatorNode extends Node{

    constructor(public operator: Token, public right: Node){
        super();
        this.posStart = this.operator.posStart;
        this.posEnd = this.right.posEnd;
    }

    toString(){
        return `(${this.operator.toString()},${this.right.toString()})`;
    }
}

export default UnaryOperatorNode;