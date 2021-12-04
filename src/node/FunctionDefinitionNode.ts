import Token from "src/lexer/Token";
import Node from "./NodeBase";

class FunctionDefinitionNode extends Node {
    constructor(public varName: Token, public argNames: Token[], public bodyNode: Node) {
        super();
        if(varName){
            this.posStart = varName.posStart;
        }else if(argNames.length > 0){
            this.posStart = argNames[0].posStart;
        }else{
            this.posStart = bodyNode.posStart;
        }
        this.posEnd = bodyNode.posEnd;
    }
}

export default FunctionDefinitionNode;