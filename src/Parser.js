const { Undefined } = require("./Atomic");
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
    TT_EQ,
    TT_STRING,
    TT_END,
    TT_COMMA,
    TT_EEQ,
    TT_GT,
    TT_GTE,
    TT_LT,
    TT_LTE,
    TT_NEQ,
    TT_NOT,
    TT_LOR,
    TT_AND,
    TT_LAND
} = require("./Contants");

const { InvalidSyntaxError } = require("./Error");
const { NumberNode, BinaryOperatorNode, UnaryOperatorNode, VarAccessNode, VarAssignmentNode, StringNode, ExecNode, BooleanNode, UndefinedNode, ifNode, IfNode, ForNode, WhileNode } = require("./Node");
const { ParseResult } = require("./Result");


class Parser{
    constructor(tokens){
        this.tokens = tokens;
        this.idx = -1;
        this.advance();
    }

    save(fileName="ast.json"){
        require('fs').writeFileSync(fileName, JSON.stringify(this.ast || {}, null, 2));
        return this;
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
            res.register_advancement();
            this.advance();
            return res.success(new NumberNode(token));
        }else if(token.type === TT_IDENTIFIER){
            res.register_advancement();
            this.advance();
            return res.success(new VarAccessNode(token));
        }else if(token.type === TT_STRING){
            res.register_advancement();
            this.advance();
            return res.success(new StringNode(token));
        }
        else if(token.type === TT_LPAREN){
            res.register_advancement();
            this.advance()
            let expression = res.register(this.expression());
            if(res.error) return res;
            if(this.currentToken.type === TT_RPAREN){
                res.register_advancement();
                this.advance();
                return res.success(expression);
            }
            return res.failure(new InvalidSyntaxError("Expected ')'", this.currentToken.posStart, this.currentToken.posEnd).toString());
        }else if(token.matches(TT_KEYWORD, "true")){
            const trueToken = this.currentToken;
            res.register_advancement();
            this.advance();
            return res.success(new BooleanNode(trueToken, true));
        }else if(token.matches(TT_KEYWORD, "false")){
            const falseToken = this.currentToken;
            res.register_advancement();
            this.advance();
            return res.success(new BooleanNode(falseToken, false));
        }else if(token.matches(TT_KEYWORD, "undefined")){
            const undefinedToken = this.currentToken;
            res.register_advancement();
            this.advance();
            return res.success(new UndefinedNode(undefinedToken, false));
        }
        else if(token.matches(TT_KEYWORD, "if")){
            let ifExpression = res.register( this.ifExpression() );
            if(res.error) return res;
            return res.success(ifExpression);
        }else if(token.matches(TT_KEYWORD, "for")){
            let forExpression = res.register( this.forExpression() );
            if(res.error) return res;
            return res.success(forExpression);
        }else if(token.matches(TT_KEYWORD, "while")){
            let whileExpression = res.register( this.whileExpression() );
            if(res.error) return res;
            return res.success(whileExpression);
        }

        return res.failure(new InvalidSyntaxError(`Expected Int, Float, '+', '-', '*', '/', or '('\n`, token.posStart, token.posEnd).toString());
    }

    whileExpression(){
        let res = new ParseResult();
        if(this.currentToken.matches(TT_KEYWORD, "while")){

            res.register_advancement();
            this.advance();

            if(this.currentToken.type !== TT_LPAREN){
                return res.failure(new InvalidSyntaxError("Expected '('", this.currentToken.posStart, this.currentToken.posEnd).toString());
            }

            res.register_advancement();
            this.advance();

            let condition = res.register(this.expression());
            if(res.error) return res;

            if(this.currentToken.type !== TT_RPAREN){
                return res.failure(new InvalidSyntaxError("Expected ')'", this.currentToken.posStart, this.currentToken.posEnd).toString());
            }
            res.register_advancement();
            this.advance();
            let body = res.register(this.expression());
            if(res.error) return res;

            return res.success(new WhileNode(condition, body));
        }
    }

    forExpression(){
        let res = new ParseResult();
        if(this.currentToken.matches(TT_KEYWORD, "for")){
            res.register_advancement();
            this.advance();

            if(this.currentToken.type !== TT_LPAREN){
                return res.failure(new InvalidSyntaxError("Expected '('", this.currentToken.posStart, this.currentToken.posEnd).toString());
            }

            res.register_advancement();
            this.advance();

            if(this.currentToken.type !== TT_IDENTIFIER){
                return res.failure(new InvalidSyntaxError("Expected Identifier", this.currentToken.posStart, this.currentToken.posEnd).toString());
            }

            let identifier = this.currentToken;
            res.register_advancement();

            this.advance();

            if(this.currentToken.type !== TT_EQ){
                return res.failure(new InvalidSyntaxError("Expected '='", this.currentToken.posStart, this.currentToken.posEnd).toString());
            }
            
            res.register_advancement();
            this.advance();
            let startValue = res.register(this.expression());
            if(res.error) return res;

            if(!this.currentToken.matches(TT_KEYWORD, "to")){
                return res.failure(new InvalidSyntaxError("Expected 'to'", this.currentToken.posStart, this.currentToken.posEnd).toString());
            }
            res.register_advancement();
            this.advance();
            let endValue = res.register(this.expression());
            if(res.error) return res;
            let stepValue = null;
            if(this.currentToken.matches(TT_KEYWORD, "step")){
                res.register_advancement();
                this.advance();
                stepValue = res.register(this.expression());
                if(res.error) return res;
            }

            if(this.currentToken.type !== TT_RPAREN){
                return res.failure(new InvalidSyntaxError("Expected ')'", this.currentToken.posStart, this.currentToken.posEnd).toString());
            }

            res.register_advancement();
            this.advance();

            let body = res.register(this.expression());
            if(res.error) return res;

            return res.success(new ForNode(identifier, startValue, endValue, stepValue, body));
        }
    }

    ifExpression(){
        let res = new ParseResult();
        let cases = [];
        let elseCase = null;

        if(this.currentToken.matches(TT_KEYWORD, "if")){
            res.register_advancement();
            this.advance();
        }

        if(this.currentToken.type != TT_LPAREN)
            return res.failure(new InvalidSyntaxError(`Expected '('`, this.currentToken.posStart, this.currentToken.posEnd).toString());
        res.register_advancement();
        this.advance();

        let condition = res.register(this.expression());
        if(res.error) return res;

        if(this.currentToken.type != TT_RPAREN)
            return res.failure(new InvalidSyntaxError(`Expected ')'`, this.currentToken.posStart, this.currentToken.posEnd).toString());

        res.register_advancement();
        this.advance();

        let consequence = res.register(this.expression());

        if(res.error) return res;

        cases.push([condition,consequence]);

        while(this.currentToken.matches(TT_KEYWORD, "elif")){
            res.register_advancement();
            this.advance();
            if(!this.currentToken.matches(TT_LPAREN))
                return res.failure(new InvalidSyntaxError(`Expected '('`, this.currentToken.posStart, this.currentToken.posEnd).toString());
            res.register_advancement();
            this.advance();
            let condition = res.register(this.expression());
            if(res.error) return res;

            if(!this.currentToken.matches(TT_RPAREN))
                return res.failure(new InvalidSyntaxError(`Expected ')'`, this.currentToken.posStart, this.currentToken.posEnd).toString());
            res.register_advancement();
            this.advance();
            let consequence = res.register(this.expression());
            if(res.error) return res;
            cases.push([condition, consequence]);
        }

        if(this.currentToken.matches(TT_KEYWORD, "else")){
            res.register_advancement();
            this.advance();
            let elseExpression = res.register(this.expression());
            if(res.error) return res;
            elseCase = elseExpression;
        }

        return res.success(new IfNode(cases,elseCase));
    }

    power(){
        return this.BinaryOperator(this.atom, [TT_POW], this.factor);
    }

    factor(){
        let token = this.currentToken;
        let res = new ParseResult();
        if([TT_PLUS, TT_MINUS].includes(token.type)){
            res.register_advancement();
            this.advance();
            let factor = res.register(this.factor());
            if(res.error) return res;
            return res.success(new UnaryOperatorNode(token, factor));
        }
        return this.power();
    }

    term(){
        return this.BinaryOperator(this.factor, [TT_MUL, TT_DIV]);
    }

    expression(){
        let res = new ParseResult();

        if(this.currentToken.matches(TT_KEYWORD, "clear")){
            const clearToken = this.currentToken;
            res.register_advancement();
            this.advance();
            return res.success(new ExecNode(clearToken, 'clear'));
        }

        if(this.currentToken.matches(TT_KEYWORD, "let")){
            res.register_advancement();
            this.advance();

            if(!this.currentToken.matches(TT_IDENTIFIER)){
                return res.failure(new InvalidSyntaxError("Expected Identifier", this.currentToken.posStart, this.currentToken.posEnd).toString());
            }

            let varName = this.currentToken;
            res.register_advancement();
            this.advance();
            if(this.currentToken.matches(TT_END)){
                res.register_advancement();
                this.advance();
                return res.success(new VarAssignmentNode(varName));
            }
            if(!this.currentToken.matches(TT_EQ)){
                return res.failure(new InvalidSyntaxError("Expected '='", this.currentToken.posStart, this.currentToken.posEnd).toString());
            }
            res.register_advancement();
            this.advance();
            let expression = res.register(this.expression());
            if(res.error) return res;
            return res.success(new VarAssignmentNode(varName, expression));
        }

        let node = res.register(this.BinaryOperator(this.comparison_expression, [TT_LOR, TT_LAND]));

        if(res.error) return res.failure(new InvalidSyntaxError(`Expected 'let', '+', '-', '*',or '/'`, this.currentToken.posStart, this.currentToken.posEnd).toString());
        return res.success(node);
    }

    comparison_expression(){
        let res = new ParseResult();
        if(this.currentToken.type == TT_NOT || this.currentToken.matches(TT_KEYWORD, "not")){
            const token = this.currentToken;
            res.register_advancement();
            this.advance();
            let node = res.register(this.comparison_expression());
            if(res.error) return res;
            return res.success(new UnaryOperatorNode(token, node));
        }
        let node = res.register(this.BinaryOperator(this.arithmetic_expression, [TT_EEQ, TT_NEQ, TT_GT, TT_GTE, TT_LT, TT_LTE]));
        
        if(res.error){
            return res.failure(new InvalidSyntaxError(`Expected '!=', '>', '>=', '<', '<=', or '=='`, this.currentToken.posStart, this.currentToken.posEnd).toString());
        }
        return res.success(node);
    }

    arithmetic_expression(){
        return this.BinaryOperator(this.term, [TT_PLUS, TT_MINUS]);
    }

    BinaryOperator(func1, operators, func2=null){
        if(func2 == null) func2 = func1;
        let res = new ParseResult();
        let left = res.register(func1.call(this));
        if(res.error) return res;

        while(operators.includes(this.currentToken.type) || [TT_LAND, TT_LOR].includes(this.currentToken.type)){
            let operator = this.currentToken;
            res.register_advancement();
            this.advance();
            let right = res.register(func2.call(this));
            if(res.error) return res;
            left = new BinaryOperatorNode(left, operator, right);
        }
        return res.success(left);
    }

    parse({save=false,fileName="ast.json"}){
        let result = this.expression();
        if(!result.error && this.currentToken.type != TT_EOF){
            return result.failure(new InvalidSyntaxError(`Expected '+', '-', '*',or '/'`, this.currentToken.posStart, this.currentToken.posEnd).toString());
        }
        this.ast = result;
        if(save) this.save(fileName);
        return result;
    }
}


module.exports = {Parser, ParseResult};