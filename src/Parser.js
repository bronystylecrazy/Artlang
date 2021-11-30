const { 
    TT_INT,
    TT_FLOAT,
    TT_PLUS,
    TT_MINUS,
    TT_MUL,
    TT_DIV,
    TT_LPAREN,
    TT_RPAREN,
    TT_NEWLINE,
    TT_EOF,
    DIGIT 
} = require("./Contants");
const { InvalidSyntaxError } = require("./Error");
const { NumberNode, BinaryOperatorNode, UnaryOperatorNode } = require("./Node");
const { ParseResult } = require("./Result");

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
        if([TT_PLUS, TT_MINUS].includes(token.type)){
            res.register(this.advance());
            let factor = res.register(this.factor());
            if(res.error) return res;
            return res.success(new UnaryOperatorNode(token, factor));
        }
        else if([TT_INT,TT_FLOAT].includes(token.type)){
            res.register(this.advance());
            return res.success(new NumberNode(token));
        }else if(token.type === TT_LPAREN){
            res.register(this.advance());
            let expression = res.register(this.expression());
            if(res.error) return res;
            if(this.currentToken.type === TT_RPAREN){
                res.register(this.advance());
                return res.success(expression);
            }
            return res.failure(new InvalidSyntaxError("Expected ')'", this.currentToken.posStart, this.currentToken.posEnd).toString());
        }
        return res.failure(new InvalidSyntaxError('Expected Int or Float', token.posStart, token.postEnd).toString());
    }

    term(){
        return this.BinaryOperator(this.factor, [TT_MUL, TT_DIV]);
    }

    expression(){
        return this.BinaryOperator(this.term, [TT_PLUS, TT_MINUS]);
    }

    BinaryOperator(func, operators){
        let res = new ParseResult();
        let left = res.register(func.call(this));
        if(res.error) return res;

        while(operators.includes(this.currentToken.type)){
            let operator = this.currentToken;
            res.register(this.advance());
            let right = res.register(func.call(this));
            if(res.error) return res;
            left = new BinaryOperatorNode(left, operator, right);
        }
        return res.success(left);
    }

    parse(){
        let result = this.expression();
        if(!result.error && this.currentToken.type != TT_EOF){
            return result.failure(new InvalidSyntaxError(`Expected '+', '-', '*',or '/'`, this.currentToken.posStart, this.currentToken.posEnd).toString());
        }
        return result;
    }
}


module.exports = {Parser, ParseResult};