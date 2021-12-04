import Token from "../lexer/Token";
import Node from "./NodeBase";

class BooleanNode extends Node {
    constructor(public token: Token, public value: boolean) {
        super();
        this.posStart = this.token.posStart;
        this.posEnd = this.token.posEnd;
    }
    toString(){
        return this.value.toString();
    }
}

export default BooleanNode;