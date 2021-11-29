class NumberNode{
    constructor(token){
        this.token = token;
        this.value = token.value;
    }
    toString(){
        return `${this.token.toString()}`;
    }
}

class BinaryOperatorNode{
    constructor(left, operator, right){
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    toString(){
        return `(${this.left},${this.operator},${this.right})`;
    }
}

module.exports = {
    NumberNode,
    BinaryOperatorNode
};