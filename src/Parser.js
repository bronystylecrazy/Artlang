const { 
    TT_INT,
    TT_FLOAT,
    TT_PLUS,
    TT_MINUS,
    TT_MUL,
    TT_DIV,
    TT_LPAREN,
    TT_RPAREN,
    DIGIT 
} = require("./Contants");
const { InvalidSyntaxError } = require("./Error");
const { NumberNode, BinaryOperatorNode } = require("./Node");

class ParseResult{
    constructor(error, node){
        this.error = error;
        this.node = node;
    }
    
    register(result){
        if(result instanceof ParseResult){
            if(result.error){
                this.error = result.error;
                return result.node;
            }
        }
        return result;
    }

    success(node){
        this.node = node;
        return this;
    }

    failure(error){
        this.error = error;
        return this;
    }
    
    toString(){
        return this.node.toString();
    }
}

class Parser{
    constructor(tokens){
        this.tokens = tokens;
        this.idx = -1;
        this.advance();
    }
    advance(){
        this.idx++;
        if(this.idx < this.tokens.length)
            this.currentToken = this.tokens[this.idx];
        return this.currentToken;
    }

    factor(){
        let token = this.currentToken;
        let res = new ParseResult();
        console.log(token)
        if([TT_INT,TT_FLOAT].includes(token.type)){
            res.register(this.advance());
            console.log(token)
            return res.success(new NumberNode(token));
        }
        return res.failure(new InvalidSyntaxError('Expected Int or Float', token.posStart, token.postEnd));
    }

    term(){
        return this.BinaryOperator(this.factor, [TT_MUL, TT_DIV]);
    }

    expression(){
        return this.BinaryOperator(this.term, [TT_PLUS, TT_MINUS]);
    }

    BinaryOperator(func, operators){
        let left = func.call(this);
        while(operators.includes(this.currentToken.type)){
            let operator = this.currentToken;
            this.advance();
            let right = func.call(this);
            left = new BinaryOperatorNode(left, operator, right);
        }
        return left;
    }

    parse(){
        let result = this.expression();
        return result;
    }
}


module.exports = Parser;