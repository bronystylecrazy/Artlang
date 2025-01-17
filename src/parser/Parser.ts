import FunctionDefinitionNode from "../node/FunctionDefinitionNode";
import Node from "../node/NodeBase";
import { TokenType } from "../constants";
import InvalidSyntaxError from "../error/InvalidSyntaxError";
import Token from "../lexer/Token";
import BinaryOperatorNode from "../node/BinaryOperatorNode";
import BooleanNode from "../node/BooleanNode";
import ExecNode from "../node/ExecNode";
import ForNode from "../node/ForNode";
import IfNode from "../node/IfNode";
import NumberNode from "../node/NumberNode";
import StringNode from "../node/StringNode";
import UnaryOperatorNode from "../node/UnaryOperatorNode";
import UndefinedNode from "../node/UndefinedNode";
import VariableAccessNode from "../node/VariableAccessNode";
import VariableAssignmentNode from "../node/VariableAssignmentNode";
import WhileNode from "../node/WhileNode";
import CaseResult from "../result/CaseResult";
import ParseResult from "../result/parseResult";
import FunctionInvokationNode from "../node/FunctionInvokationNode";

class Parser{
    public idx: number;
    public ast;
    public currentToken: Token;

    constructor(public tokens?: Token[]){
        this.tokens = this.tokens || [];
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

    functionInvokation(){
        let res = new ParseResult();
        let atom = res.register(this.atom());
        if(res.error) return res;

        if(this.currentToken.is(TokenType.LPAREN)){
            res.register_advancement();
            this.advance();
            let argumentNodes: Node[] = [];
            if(res.error) return res;

            if(this.currentToken.is(TokenType.RPAREN)){
                res.register_advancement();
                this.advance();
            }else{
                argumentNodes.push(res.register(this.expression()));
                if(res.error)
                    return res.failure(new InvalidSyntaxError("Expected ')'", this.currentToken.posStart, this.currentToken.posEnd));
                
                while(this.currentToken.is(TokenType.COMMA)){
                    res.register_advancement();
                    this.advance();
                    argumentNodes.push(res.register(this.expression()));
                    if(res.error) return res;
                }

                if(this.currentToken.isNot(TokenType.RPAREN)){
                    return res.failure(new InvalidSyntaxError("Expected ')'", this.currentToken.posStart, this.currentToken.posEnd));
                }
                res.register_advancement();
                this.advance();
            }

            return res.success(new FunctionInvokationNode(atom, argumentNodes));
        }
        return res.success(atom);
    }

    atom(){
        let token = this.currentToken;
        let res = new ParseResult();
        if(token.is(TokenType.INT,TokenType.FLOAT)){
            res.register_advancement();
            this.advance();
            return res.success(new NumberNode(token, token.value));
        }else if(token.is(TokenType.IDENTIFIER)){
            res.register_advancement();
            this.advance();
            return res.success(new VariableAccessNode(token));
        }else if(token.is(TokenType.STRING)){
            res.register_advancement();
            this.advance();
            return res.success(new StringNode(token, token.value));
        }
        else if(token.is(TokenType.LPAREN)){
            res.register_advancement();
            this.advance()
            let expression = res.register(this.expression());
            if(res.error) return res;
            if(this.currentToken.is(TokenType.RPAREN)){
                res.register_advancement();
                this.advance();
                return res.success(expression);
            }
            return res.failure(new InvalidSyntaxError("Expected ')'", this.currentToken.posStart, this.currentToken.posEnd));
        }else if(token.matches(TokenType.KEYWORD, "true")){
            const trueToken = this.currentToken;
            res.register_advancement();
            this.advance();
            return res.success(new BooleanNode(trueToken, true));
        }else if(token.matches(TokenType.KEYWORD, "false")){
            const falseToken = this.currentToken;
            res.register_advancement();
            this.advance();
            return res.success(new BooleanNode(falseToken, false));
        }else if(token.matches(TokenType.KEYWORD, "undefined")){
            const undefinedToken = this.currentToken;
            res.register_advancement();
            this.advance();
            return res.success(new UndefinedNode(undefinedToken));
        }
        else if(token.matches(TokenType.KEYWORD, "if")){
            let ifExpression = res.register( this.ifExpression() );
            if(res.error) return res;
            return res.success(ifExpression);
        }else if(token.matches(TokenType.KEYWORD, "for")){
            let forExpression = res.register( this.forExpression() );
            if(res.error) return res;
            return res.success(forExpression);
        }else if(token.matches(TokenType.KEYWORD, "while")){
            let whileExpression = res.register( this.whileExpression() );
            if(res.error) return res;
            return res.success(whileExpression);
        }else if(token.matches(TokenType.KEYWORD, "function")){
            let functionDefinition = res.register( this.functionDefinition() );
            if(res.error) return res;
            return res.success(functionDefinition);
        }

        return res.failure(new InvalidSyntaxError(`Expected Int, Float, '+', '-', '*', '/', or '('\n`, token.posStart, token.posEnd));
    }

    power(){
        return this.BinaryOperator(this.functionInvokation, [TokenType.POW], this.factor);
    }

    factor(){
        let token = this.currentToken;
        let res = new ParseResult();
        if(token.is(TokenType.PLUS, TokenType.MINUS)){
            res.register_advancement();
            this.advance();

            let factor = res.register(this.factor());
            if(res.error) return res;

            return res.success(new UnaryOperatorNode(token, factor));
        }
        return this.power();
    }

    term(){
        return this.BinaryOperator(this.factor, [TokenType.MUL, TokenType.DIV]);
    }

    expression(){
        let res = new ParseResult();

        if(this.currentToken.matches(TokenType.KEYWORD, "clear")){
            const clearToken = this.currentToken;
            res.register_advancement();
            this.advance();
            return res.success(new ExecNode(clearToken, 'clear'));
        }

        if(this.currentToken.matches(TokenType.KEYWORD, "let")){
            res.register_advancement();
            this.advance();

            if(!this.currentToken.matches(TokenType.IDENTIFIER)){
                return res.failure(new InvalidSyntaxError("Expected Identifier", this.currentToken.posStart, this.currentToken.posEnd));
            }

            let varName = this.currentToken;
            res.register_advancement();
            this.advance();
            if(this.currentToken.matches(TokenType.END)){
                res.register_advancement();
                this.advance();
                return res.success(new VariableAssignmentNode(varName));
            }
            if(!this.currentToken.matches(TokenType.EQ)){
                return res.failure(new InvalidSyntaxError("Expected '='", this.currentToken.posStart, this.currentToken.posEnd));
            }
            res.register_advancement();
            this.advance();
            let expression = res.register(this.expression());
            if(res.error) return res;
            return res.success(new VariableAssignmentNode(varName, expression));
        }

        let node = res.register(this.BinaryOperator(this.comparison_expression, [TokenType.LOR, TokenType.LAND]));

        if(res.error) return res.failure(new InvalidSyntaxError(`Expected 'let', '+', '-', '*',or '/'`, this.currentToken.posStart, this.currentToken.posEnd));
        return res.success(node);
    }

    comparison_expression(){
        let res = new ParseResult();
        if(this.currentToken.is(TokenType.NOT) || this.currentToken.matches(TokenType.KEYWORD, "not")){
            const token = this.currentToken;
            res.register_advancement();
            this.advance();
            let node = res.register(this.comparison_expression());
            if(res.error) return res;
            return res.success(new UnaryOperatorNode(token, node));
        }

        let node = res.register(this.BinaryOperator(this.arithmetic_expression, [TokenType.EEQ, TokenType.NEQ, TokenType.GT, TokenType.GTE, TokenType.LT, TokenType.LTE]));
        
        if(res.error){
            return res.failure(new InvalidSyntaxError(`Expected '!=', '>', '>=', '<', '<=', or '=='`, this.currentToken.posStart, this.currentToken.posEnd));
        }
        return res.success(node);
    }

    arithmetic_expression(){
        return this.BinaryOperator(this.term, [TokenType.PLUS, TokenType.MINUS]);
    }

    
    functionDefinition(){
        let res = new ParseResult();
        let variableNameToken: Token = null;
        let argumentTokens: Token[] = [];

        if(!this.currentToken.matches(TokenType.KEYWORD, "function"))
            return res.failure(new InvalidSyntaxError("Expected 'function'", this.currentToken.posStart, this.currentToken.posEnd));
        res.register_advancement();
        this.advance();

        if(this.currentToken.is(TokenType.IDENTIFIER)){
            variableNameToken = this.currentToken;
            res.register_advancement();
            this.advance();

            if(this.currentToken.isNot(TokenType.LPAREN)){
                return res.failure(new InvalidSyntaxError("Expected '('", this.currentToken.posStart, this.currentToken.posEnd));
            }
        }else{
            if(this.currentToken.isNot(TokenType.LPAREN)){
                return res.failure(new InvalidSyntaxError("Expected identifier or '('", this.currentToken.posStart, this.currentToken.posEnd));
            }
        }

        res.register_advancement();
        this.advance();
        if(this.currentToken.is(TokenType.IDENTIFIER)){
            argumentTokens.push(this.currentToken);
            res.register_advancement();
            this.advance();
            while(this.currentToken.is(TokenType.COMMA)){
                res.register_advancement();
                this.advance();
                if(this.currentToken.is(TokenType.IDENTIFIER)){
                    argumentTokens.push(this.currentToken);
                    res.register_advancement();
                    this.advance();
                }else{
                    return res.failure(new InvalidSyntaxError("Expected identifier", this.currentToken.posStart, this.currentToken.posEnd));
                }
            }
            if(this.currentToken.isNot(TokenType.RPAREN)){
                return res.failure(new InvalidSyntaxError("Expected ',' or ')'", this.currentToken.posStart, this.currentToken.posEnd));
            }
        }else{
            if(this.currentToken.isNot(TokenType.RPAREN)){
                return res.failure(new InvalidSyntaxError("Expected identifier or ')'", this.currentToken.posStart, this.currentToken.posEnd));
            }
        }

        res.register_advancement();
        this.advance();

        if(this.currentToken.isNot(TokenType.ARROW)){
            return res.failure(new InvalidSyntaxError("Expected '{'", this.currentToken.posStart, this.currentToken.posEnd));
        }

        res.register_advancement();
        this.advance();

        let nodeToReturn: Node = res.register(this.expression());
        if(res.error) return res;
        return res.success(new FunctionDefinitionNode(variableNameToken, argumentTokens, nodeToReturn));
    }

    whileExpression(){
        let res = new ParseResult();
        if(this.currentToken.matches(TokenType.KEYWORD, "while")){

            res.register_advancement();
            this.advance();

            if(this.currentToken.isNot(TokenType.LPAREN)){
                return res.failure(new InvalidSyntaxError("Expected '('", this.currentToken.posStart, this.currentToken.posEnd));
            }

            res.register_advancement();
            this.advance();

            let condition = res.register(this.expression());
            if(res.error) return res;

            if(this.currentToken.isNot(TokenType.RPAREN)){
                return res.failure(new InvalidSyntaxError("Expected ')'", this.currentToken.posStart, this.currentToken.posEnd));
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
        if(this.currentToken.matches(TokenType.KEYWORD, "for")){
            res.register_advancement();
            this.advance();

            if(this.currentToken.isNot(TokenType.LPAREN)){
                return res.failure(new InvalidSyntaxError("Expected '('", this.currentToken.posStart, this.currentToken.posEnd));
            }

            res.register_advancement();
            this.advance();

            if(this.currentToken.isNot(TokenType.LPAREN)){
                return res.failure(new InvalidSyntaxError("Expected Identifier", this.currentToken.posStart, this.currentToken.posEnd));
            }

            let identifier = this.currentToken;
            res.register_advancement();

            this.advance();

            if(this.currentToken.isNot(TokenType.EQ)){
                return res.failure(new InvalidSyntaxError("Expected '='", this.currentToken.posStart, this.currentToken.posEnd));
            }
            
            res.register_advancement();
            this.advance();
            let startValue = res.register(this.expression());
            if(res.error) return res;

            if(!this.currentToken.matches(TokenType.KEYWORD, "to")){
                return res.failure(new InvalidSyntaxError("Expected 'to'", this.currentToken.posStart, this.currentToken.posEnd));
            }
            res.register_advancement();
            this.advance();
            let endValue = res.register(this.expression());
            if(res.error) return res;
            let stepValue = null;
            if(this.currentToken.matches(TokenType.KEYWORD, "step")){
                res.register_advancement();
                this.advance();
                stepValue = res.register(this.expression());
                if(res.error) return res;
            }

            if(this.currentToken.isNot( TokenType.RPAREN )){
                return res.failure(new InvalidSyntaxError("Expected ')'", this.currentToken.posStart, this.currentToken.posEnd));
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

        if(this.currentToken.matches(TokenType.KEYWORD, "if")){
            res.register_advancement();
            this.advance();
        }

        if(this.currentToken.isNot(TokenType.LPAREN))
            return res.failure(new InvalidSyntaxError(`Expected '('`, this.currentToken.posStart, this.currentToken.posEnd));
        res.register_advancement();
        this.advance();

        let condition = res.register(this.expression());
        if(res.error) return res;

        if(this.currentToken.isNot(TokenType.RPAREN))
            return res.failure(new InvalidSyntaxError(`Expected ')'`, this.currentToken.posStart, this.currentToken.posEnd));

        res.register_advancement();
        this.advance();

        let consequence = res.register(this.expression());

        if(res.error) return res;

        cases.push(new CaseResult(condition,consequence));

        while(this.currentToken.matches(TokenType.KEYWORD, "elif")){
            res.register_advancement();
            this.advance();

            if(!this.currentToken.matches(TokenType.LPAREN))
                return res.failure(new InvalidSyntaxError(`Expected '('`, this.currentToken.posStart, this.currentToken.posEnd));
            
            res.register_advancement();
            this.advance();

            let condition = res.register(this.expression());
            if(res.error) return res;

            if(!this.currentToken.matches(TokenType.RPAREN))
                return res.failure(new InvalidSyntaxError(`Expected ')'`, this.currentToken.posStart, this.currentToken.posEnd));
            res.register_advancement();
            this.advance();
            let consequence = res.register(this.expression());
            if(res.error) return res;
            cases.push(new CaseResult(condition, consequence));
        }

        if(this.currentToken.matches(TokenType.KEYWORD, "else")){
            res.register_advancement();
            this.advance();
            let elseExpression = res.register(this.expression());
            if(res.error) return res;
            elseCase = elseExpression;
        }

        return res.success(new IfNode(cases,elseCase));
    }

    BinaryOperator(func1, operators: TokenType[], func2=null){
        if(func2 == null) func2 = func1;
        let res = new ParseResult();
        let left = res.register(func1.call(this));
        if(res.error) return res;

        while(this.currentToken.is(...operators) || this.currentToken.is(TokenType.LAND, TokenType.LOR) ){
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
        if(!result.error && this.currentToken.isNot(TokenType.EOF)){
            return result.failure(new InvalidSyntaxError(`Expected '+', '-', '*',or '/'`, this.currentToken.posStart, this.currentToken.posEnd));
        }
        this.ast = result;
        if(save) this.save(fileName);
        return result;
    }
}

export default Parser;