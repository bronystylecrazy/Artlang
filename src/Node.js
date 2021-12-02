class Node{
    constructor(){
        this.name = this.constructor.name;
    }
}

class NumberNode extends Node{
    constructor(token){
        super();
        this.token = token;
        this.value = token.value;
        this.posStart = this.token.posStart;
        this.posEnd = this.token.posEnd;
    }
    toString(){
        return `${this.token.toString()}`;
    }
}

class StringNode extends Node {
    constructor(token){
        super();
        this.token = token;
        this.value = token.value;
        this.posStart = this.token.posStart;
        this.posEnd = this.token.posEnd;
    }
    toString(){
        return `"${this.token.toString()}"`;
    }
}

class BinaryOperatorNode extends Node{
    constructor(left, operator, right){
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.posStart = this.left.posStart;
        this.posEnd = this.right.posEnd;
    }

    toString(){
        return `(${this.left},${this.operator},${this.right})`;
    }
}

class UnaryOperatorNode extends Node{
    constructor(operator, right){
        super();
        this.operator = operator;
        this.right = right;
        this.posStart = this.operator.posStart;
        this.posEnd = this.right.posEnd;
    }

    toString(){
        return `(${this.operator.toString()},${this.right.toString()})`;
    }
}

class VarAccessNode extends Node{
    constructor(varNameToken){
        super();
        this.token = varNameToken;
        this.posStart = this.token.posStart;
        this.posEnd = this.token.posEnd;
    }
}

class UndefinedNode extends Node{
    constructor(token){
        super();
        this.token = token;
        this.value = 'undefined';
        this.posStart = this.token.posStart;
        this.posEnd = this.token.posEnd;
    }

    toString(){
        return `undefined`;
    }
}

class VarAssignmentNode extends Node{
    constructor(varNameToken, valueNode=new UndefinedNode()){
        super();
        this.token = varNameToken;
        this.valueNode = valueNode;
        this.posStart = this.token.posStart;
        this.posEnd = this.valueNode.posEnd;
    }
}

class ExecNode extends Node{
    constructor(token, command){
        super();
        this.token = token;
        this.command = command;
        this.posStart = this.token.posStart;
        this.posEnd = this.token.posEnd;
    }
}

class BooleanNode extends Node {
    constructor(token, value){
        super();
        this.token = token;
        this.value = value || token.value;
        this.posStart = this.token.posStart;
        this.posEnd = this.token.posEnd;
    }
}

class IfNode extends Node{
    constructor(cases, elseCase){
        super();
        this.cases = cases;
        this.elseCase = elseCase;
        this.posStart = this.cases[0][0].posStart;
        this.posEnd = this.elseCase ? this.elseCase.posEnd : this.cases[this.cases.length-1][0].posEnd;
    }
}

class ForNode extends Node{
    constructor(varNameToken, startNode, endNode, stepNode, bodyNode){
        super();
        this.varNameToken = varNameToken;
        this.startNode = startNode;
        this.endNode = endNode;
        this.stepNode = stepNode;
        this.bodyNode = bodyNode;
        this.posStart = this.varNameToken.posStart;
        this.posEnd = this.bodyNode.posEnd;
    }
}

class WhileNode extends Node {
    constructor(conditionNode, bodyNode){
        super();
        this.conditionNode = conditionNode;
        this.bodyNode = bodyNode;
        this.posStart = this.conditionNode.posStart.copy();
        this.posEnd = this.bodyNode.posEnd.copy();
    }
}

module.exports = {
    BinaryOperatorNode,
    BooleanNode,
    ExecNode,
    Node,
    NumberNode,
    StringNode,
    UnaryOperatorNode,
    UndefinedNode,
    VarAccessNode,
    VarAssignmentNode,
    IfNode,
    ForNode,
    WhileNode
};