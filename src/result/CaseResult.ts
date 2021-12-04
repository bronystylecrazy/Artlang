import Node from "../node/NodeBase";


class CaseResult {
    constructor(public condition: Node, public consequence: Node) {}
}

export default CaseResult;