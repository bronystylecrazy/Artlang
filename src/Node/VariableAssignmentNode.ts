import Token from "../Lexer/Token";
import Node from "./NodeBase";
import UndefinedNode from "./UndefinedNode";

class VariableAssignmentNode extends Node{
    constructor(public token: Token, public valueNode?: Node){
        super();
        this.posStart = this.token.posStart;
        this.posEnd = this.valueNode.posEnd;
    }
}

export default VariableAssignmentNode;