import Token from "src/lexer/Token";
import Node from "./NodeBase";

class FunctionInvokationNode extends Node {
    constructor(public targetNode: Node, public argNodes: Node[]) {
        super();
        this.posStart = targetNode.posStart;
        if(argNodes.length > 0) {
            this.posEnd = argNodes[argNodes.length - 1].posEnd;
        } else {
            this.posEnd = targetNode.posEnd;
        }
    }
}

export default FunctionInvokationNode;