import Token from "../Lexer/Token";
import Node from "./NodeBase";

class VarAccessNode extends Node{
    constructor(public token: Token){
        super();
        this.posStart = this.token.posStart;
        this.posEnd = this.token.posEnd;
    }
}

export default VarAccessNode;