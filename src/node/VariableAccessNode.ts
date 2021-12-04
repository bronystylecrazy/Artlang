import Token from "../lexer/Token";
import Node from "./NodeBase";

class VariableAccessNode extends Node{
    constructor(public token: Token){
        super();
        this.posStart = this.token.posStart;
        this.posEnd = this.token.posEnd;
    }
}

export default VariableAccessNode;