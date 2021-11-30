const { 
    TT_INT,
    TT_FLOAT,
    TT_PLUS,
    TT_MINUS,
    TT_MUL,
    TT_DIV,
    TT_POW,
    TT_LPAREN,
    TT_RPAREN,
    TT_NEWLINE,
    TT_EOF,
    noop,
    DIGIT, 
    TT_KEYWORD,
    TT_IDENTIFIER,
    TT_EQ
} = require("./Contants");
const { InvalidSyntaxError } = require("./Error");
const { NumberNode, BinaryOperatorNode, UnaryOperatorNode, VarAccessNode, VarAssignmentNode } = require("./Node");
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

    atom(){
        let token = this.currentToken;
        let res = new ParseResult();

        if([TT_INT,TT_FLOAT].includes(token.type)){
            res.register(this.advance());
            return res.success(new NumberNode(token));
        }else if(token.type === TT_IDENTIFIER){
            res.register(this.advance());
            return res.success(new VarAccessNode(token));
        }
        else if(token.type === TT_LPAREN){
            res.register(this.advance());
            let expression = res.register(this.expression());
            if(res.error) return res;
            if(this.currentToken.type === TT_RPAREN){
                res.register(this.advance());
                return res.success(expression);
            }
            return res.failure(new InvalidSyntaxError("Expected ')'", this.currentToken.posStart, this.currentToken.posEnd).toString());
        }
        return res.failure(new InvalidSyntaxError(`Expected Int, Float, '+', '-', '*', '/', or '('\n`, token.posStart, token.posEnd).toString());
    }

    power(){
        return this.BinaryOperator(this.atom, [TT_POW], this.factor);
    }

    factor(){
        let token = this.currentToken;
        let res = new ParseResult();
        if([TT_PLUS, TT_MINUS].includes(token.type)){
            res.register(this.advance());
            let factor = res.register(this.factor());
            if(res.error) return res;
            console.log('Unary')
            return res.success(new UnaryOperatorNode(token, factor));
        }
        return this.power();
    }

    term(){
        return this.BinaryOperator(this.factor, [TT_MUL, TT_DIV]);
    }

    expression(){
        let res = new ParseResult();
        if(this.currentToken.matches(TT_KEYWORD, "let")){
            res.register(this.advance());
            if(!this.currentToken.matches(TT_IDENTIFIER)){
                return res.failure(new InvalidSyntaxError("Expected Identifier", this.currentToken.posStart, this.currentToken.posEnd).toString());
            }
            let varName = this.currentToken;
            res.register(this.advance());
            if(!this.currentToken.matches(TT_EQ)){
                return res.failure(new InvalidSyntaxError("Expected '='", this.currentToken.posStart, this.currentToken.posEnd).toString());
            }
            res.register(this.advance());
            let expression = res.register(this.expression());
            if(res.error) return res;
            return res.success(new VarAssignmentNode(varName, expression));
        }
        return this.BinaryOperator(this.term, [TT_PLUS, TT_MINUS]);
    }

    BinaryOperator(func1, operators, func2=null){
        if(func2 == null) func2 = func1;
        let res = new ParseResult();
        let left = res.register(func1.call(this));
        if(res.error) return res;

        while(operators.includes(this.currentToken.type)){
            let operator = this.currentToken;
            res.register(this.advance());
            let right = res.register(func2.call(this));
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