import Node from "./NodeBase";

class WhileNode extends Node {
    constructor(public conditionNode: Node, public bodyNode: Node){
        super();
        this.posStart = this.conditionNode.posStart.copy();
        this.posEnd = this.bodyNode.posEnd.copy();
    }
}

export default WhileNode;