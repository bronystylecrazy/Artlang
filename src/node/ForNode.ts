import Token from "src/lexer/Token";
import Node from "./NodeBase";

class ForNode extends Node{
    constructor(
        public varNameToken: Token,
        public startNode: Node,
        public endNode: Node,
        public stepNode: Node,
        public bodyNode: Node
    ){
        super();
        this.posStart = this.varNameToken.posStart;
        this.posEnd = this.bodyNode.posEnd;
    }
}

export default ForNode;