import Boolean from "../atomic/Boolean";
import Number from "../atomic/Number";
import String from "../atomic/String";
import Undefined from "../atomic/Undefined";
import { TokenType } from "../constants";
import Context from "../context/Context";
import RuntimeError from "../error/RuntimeError";
import BinaryOperatorNode from "../node/BinaryOperatorNode";
import NumberNode from "../node/NumberNode";
import UnaryOperatorNode from "../node/UnaryOperatorNode";
import RuntimeResult from "../result/RuntimeResult";
import ParseResult from "../result/parseResult";
import VariableAccessNode from "../node/VariableAccessNode";
import VariableAssignmentNode from "../node/VariableAssignmentNode";
import StringNode from "../node/StringNode";
import BooleanNode from "../node/BooleanNode";
import UndefinedNode from "../node/UndefinedNode";
import IfNode from "../node/IfNode";
import ForNode from "../node/ForNode";
import WhileNode from "../node/WhileNode";
import Error from "../error/ErrorBase";
import Node from "../node/NodeBase";
import Atomic from "src/atomic/Atomic";

class Interpreter{

    visit(_node: Node, context: Context): RuntimeResult {
        let node = _node;

        while(node instanceof ParseResult){
            node = node.node;
        }

        let methodName = `visit_${node.constructor.name}`;
        let method = this[methodName] || this.no_visit_method;
        return method.call(this, node, context);
    }

    no_visit_method(node: Node,context: Context): RuntimeResult {
        return new RuntimeResult().failure(new RuntimeError(`No visit_${node.constructor.name} method defined`, node.posStart, node.posEnd, context));
    }

    visit_NumberNode(node: NumberNode,context: Context): RuntimeResult{
        return new RuntimeResult().success(new Number(node.value).setContext(context).setPos(node.posStart, node.posEnd));
    }

    visit_BinaryOperatorNode(node: BinaryOperatorNode,context: Context){
        let res = new RuntimeResult();
        let result;
        let left = res.register(this.visit(node.left,context));
        if(res.error) return res.failure(res.error);
        let right = res.register(this.visit(node.right,context));

        if(res.error) return res.failure(res.error);
        if(node.operator.is(TokenType.PLUS)) {
            if(!left.add) return res.failure(new RuntimeError(`Operator '+' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
            result = left.add(right);
            if(!result) return res.failure(new RuntimeError(`Operator '+' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
        }else if(node.operator.is(TokenType.MINUS)){
            if(!left.sub) return res.failure(new RuntimeError(`Operator '-' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
            result = left.sub(right);
            if(!result) return res.failure(new RuntimeError(`Operator '-' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
        }else if(node.operator.is(TokenType.MUL)){
            if(!left.mul) return res.failure(new RuntimeError(`Operator '*' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
            result = left.mul(right);
            if(!result) return res.failure(new RuntimeError(`Operator '*' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
        }else if(node.operator.is(TokenType.DIV)){
            if(!left.div) return res.failure(new RuntimeError(`Operator '/' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
            result = left.div(right);
            if(!result) return res.failure(new RuntimeError(`Operator '/' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
        }else if(node.operator.is(TokenType.POW)){
            if(!left.pow) return res.failure(new RuntimeError(`Operator '**' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
            result = left.pow(right);
            if(!result) return res.failure(new RuntimeError(`Operator '**' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
        }else if(node.operator.is(TokenType.EEQ)){
            if(!left.equals) return res.failure(new RuntimeError(`Operator '==' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
            result = left.equals(right);
            if(!result) return res.failure(new RuntimeError(`Operator '==' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
        }else if(node.operator.is(TokenType.NEQ)){
            if(!left.notEquals) return res.failure(new RuntimeError(`Operator '!=' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
            result = left.notEquals(right);
            if(!result) return res.failure(new RuntimeError(`Operator '!=' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
        }else if(node.operator.is(TokenType.LT)){
            if(!left.lessThan) return res.failure(new RuntimeError(`Operator '<' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
            result = left.lessThan(right);
            if(!result) return res.failure(new RuntimeError(`Operator '<' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
        }else if(node.operator.is(TokenType.LTE)){
            if(!left.lessThanOrEqual) return res.failure(new RuntimeError(`Operator '<=' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
            result = left.lessThanOrEqual(right);
            if(!result) return res.failure(new RuntimeError(`Operator '<=' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
        }else if(node.operator.is(TokenType.GT)){
            if(!left.greaterThan) return res.failure(new RuntimeError(`Operator '>' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
            result = left.greaterThan(right);
            if(!result) return res.failure(new RuntimeError(`Operator '>' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
        }else if(node.operator.is(TokenType.GTE)){
            if(!left.greaterThanOrEqual) return res.failure(new RuntimeError(`Operator '>=' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
            result = left.greaterThanOrEqual(right);
            if(!result) return res.failure(new RuntimeError(`Operator '>=' is not defined for type '${left.constructor.name}'`, node.posStart, node.posEnd, context));
        }

        if(result instanceof Error){
            return res.failure(result);
        }

        if(result.error){
            return res.failure(result.error);
        }
        return res.success(result.setPos(node.posStart, node.posEnd));
    }

    visit_UnaryOperatorNode(node: UnaryOperatorNode,context: Context): RuntimeResult{
        let res = new RuntimeResult();
        let right = res.register(this.visit(node.right,context));
        if(node.operator.is(TokenType.MINUS)){
            right = right.mul(new Number(-1, node.posStart, node.posEnd));
        }else if(node.operator.is(TokenType.PLUS)){
            if(right instanceof String){
                if(right.value == parseInt(right.value)){
                    right = res.success(new Number(parseInt(right.value), node.posStart, node.posEnd, context));
                }else{
                    right = res.success(new String(right.value, node.posStart, node.posEnd, context));
                }
            }else{
                right = right.mul(new Number(1, node.posStart, node.posEnd));
            }
        }else if(node.operator.is(TokenType.NOT) || node.operator.matches(TokenType.KEYWORD,'not')){
            if(right instanceof Boolean){
                right = res.success(new Boolean(!right.value, node.posStart, node.posEnd, context));
            }else if(right instanceof Undefined){
                right = res.success(new Boolean(true, node.posStart, node.posEnd, context));
            }else if(right instanceof Number || right instanceof String){
                right =  res.success(new Boolean(false, node.posStart, node.posEnd, context));
            }
        }

        if(right.error)
            return res.failure(right.error);
        let value = right.value.copy().setPos(node.posStart, node.posEnd);
        return res.success(value);
    }

    visit_VariableAccessNode(node: VariableAccessNode,context: Context): RuntimeResult {
        let res = new RuntimeResult();
        let varName = node.token.value;
        let value: Atomic = context.symbols.get(varName);
        if(!value){
            return res.failure(new RuntimeError(`Undefined variable '${varName}'`, node.posStart, node.posEnd, context));
        }
        value = value.copy().setPos(node.posStart, node.posEnd);
        return res.success(value);
    }

    visit_VariableAssignmentNode(node: VariableAssignmentNode,context: Context): RuntimeResult{
        let res = new RuntimeResult();
        let varName = node.token.value;
        let value = res.register(this.visit(node.valueNode,context));
        if(res.error) return res;
        // if(varName in context.symbols){
        //     return res.failure(new RuntimeError(`Variable '${varName}' is already defined`, node.posStart, node.posEnd, context));
        // }
        context.symbols.set(varName, value);
        return res.success(value);
    }

    visit_StringNode(node: StringNode, context: Context): RuntimeResult{
        return new RuntimeResult().success(new String(node.value).setPos(node.posStart, node.posEnd).setContext(context));
    }

    visit_BooleanNode(node: BooleanNode, context: Context): RuntimeResult{
        return new RuntimeResult().success(new Boolean(node.value).setPos(node.posStart, node.posEnd).setContext(context));
    }

    visit_ExecNode(node, context: Context): RuntimeResult{
        if(node.command === 'clear')
            console.clear();
        return new RuntimeResult().success(new Undefined().setPos(node.posStart, node.posEnd).setContext(context));
    }

    visit_UndefinedNode(node: UndefinedNode, context: Context): RuntimeResult{
        return new RuntimeResult().success(new Undefined().setPos(node.posStart, node.posEnd).setContext(context));
    }

    visit_IfNode(node: IfNode, context: Context): RuntimeResult{
        let res = new RuntimeResult();
        for( let caseResult of node.cases){
            let conditionResult = res.register(this.visit(caseResult.condition,context));
            if(res.error) return res;
            if(conditionResult.isTrue()){
                let expressionResult = res.register(this.visit(caseResult.consequence,context));
                if(res.error) return res;
                return res.success(expressionResult);
            }
        }
        if(node.elseCase){
            let elseResult = res.register(this.visit(node.elseCase,context));
            if(res.error) return res;
            return res.success(elseResult);
        }

        return res.success(new Undefined().setPos(node.posStart, node.posEnd).setContext(context));
    }

    visit_ForNode(node: ForNode, context: Context): RuntimeResult{
        let res = new RuntimeResult();
        let result = new RuntimeResult();
        let start = res.register(this.visit(node.startNode,context));
        if(res.error) return res;
        let end = res.register(this.visit(node.endNode,context));
        if(res.error) return res;
        let step = new Number(1);
        if(node.stepNode){
            step = res.register(this.visit(node.stepNode,context));
        }

        if(res.error) return res;

        let index = start;
        while(index.lessThan(end).isTrue()){
            context.symbols[node.varNameToken.value] = new Number(index);
            let expressionResult = res.register(this.visit(node.bodyNode,context));
            if(res.error) return res;
            result = expressionResult;
            index = res.register(index.add(step));
            if(res.error) return res;
        }

        return result;
    }

    visit_WhileNode(node: WhileNode, context: Context): RuntimeResult{
        let res = new RuntimeResult();
        let result = new RuntimeResult();

        while(res.register(this.visit(node.conditionNode,context)).isTrue()){
            let expressionResult = res.register(this.visit(node.bodyNode,context));
            if(res.error) return res;
            result = expressionResult;
        }
        return result;
    }
}

export default Interpreter;