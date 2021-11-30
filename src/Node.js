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

module.exports = {
    Node,
    NumberNode,
    BinaryOperatorNode,
    UnaryOperatorNode
};