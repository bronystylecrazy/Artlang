import CaseResult from "src/result/CaseResult";
import Node from "./NodeBase";

class IfNode extends Node{
    constructor(public cases: CaseResult[], public elseCase?: Node){
        super();
        this.posStart = this.cases[0].condition.posStart;
        this.posEnd = this.elseCase ? this.elseCase.posEnd : this.cases[this.cases.length-1].consequence.posEnd;
    }
}

export default IfNode;