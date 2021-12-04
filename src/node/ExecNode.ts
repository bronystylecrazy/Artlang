import Token from "src/lexer/Token";
import Node from "./NodeBase";

class ExecNode extends Node{
    constructor(public token: Token,public command: string){
        super();
        this.posStart = this.token.posStart;
        this.posEnd = this.token.posEnd;
    }
}

export default ExecNode;