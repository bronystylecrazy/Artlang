const colors = require('colors');
const { TT_PLUS, TT_MUL, TT_MINUS, TT_DIV, TT_POW, TT_EEQ, TT_NOT, TT_NEQ, TT_LT, TT_GT, TT_GTE, TT_LTE, TT_KEYWORD } = require('./Contants');
const { RuntimeError } = require('./Error');
const { ParseResult } = require('./Parser');
const { RuntimeResult } = require('./Result');
const { Number, String, Undefined, Boolean } = require('./Atomic');

class Interpreter{

    visit(_node, context) {
        let node = _node;
        while(node instanceof ParseResult){
            node = node.node;
        }
        let methodName = `visit_${node.constructor.name}`;
        let method = this[methodName] || this.no_visit_method;
        return method.call(this, node, context);
    }

    no_visit_method(node,context) {
        return new RuntimeResult().failure(new RuntimeError(`No visit_${node.constructor.name} method defined`, node.posStart, node.posEnd, context));
    }

    visit_NumberNode(node,context){
        return new RuntimeResult().success(new Number(node.value).setContext(context).setPos(node.posStart, node.posEnd));
    }

    visit_BinaryOperatorNode(node,context){
        let res = new RuntimeResult();
        let result;
        let left = res.register(this.visit(node.left,context));
        if(res.error) return res.failure(res.error.toString());
        let right = res.register(this.visit(node.right,context));
        if(res.error) return res.failure(res.error.toString());
        if(node.operator.type == TT_PLUS){
            console.log(left,right);
            result = left.add(right);
        }else if(node.operator.type == TT_MINUS){
            result = left.sub(right);
        }else if(node.operator.type == TT_MUL){
            result = left.mul(right);
            
        }else if(node.operator.type == TT_DIV){
            result = left.div(right);
        }else if(node.operator.type == TT_POW){
            result = left.pow(right);
        }else if(node.operator.type == TT_EEQ){
            result = left.equals(right);
        }else if(node.operator.type == TT_NEQ){
            result = left.notEquals(right);
        }else if(node.operator.type == TT_LT){
            result = left.lessThan(right);
        }else if(node.operator.type == TT_LTE){
            result = left.lessThanOrEqual(right);
        }else if(node.operator.type == TT_GT){
            result = left.greaterThan(right);
        }else if(node.operator.type == TT_GTE){
            result = left.greaterThanOrEqual(right);
        }

        if(result.error){
            return res.failure(result.error.toString());
        }
        return res.success(result.setPos(node.posStart, node.posEnd));
    }

    visit_UnaryOperatorNode(node,context){
        let res = new RuntimeResult();
        let right = res.register(this.visit(node.right),context);
        if(node.operator.type == TT_MINUS){
            right = right.mul(new Number(-1, node.posStart, node.posEnd));
        }else if(node.operator.type == TT_PLUS){
            if(right instanceof String){
                if(right.value == parseInt(right.value)){
                    right = res.success(new Number(parseInt(right.value), node.posStart, node.posEnd, context));
                }else{
                    right = res.success(new String(right.value, node.posStart, node.posEnd, context));
                }
            }else{
                right = right.mul(new Number(1, node.posStart, node.posEnd));
            }
        }else if(node.operator.type == TT_NOT || node.operator.matches(TT_KEYWORD,'not')){
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
        
        return res.success(right.setPos(node.posStart, node.posEnd));
    }

    visit_VarAccessNode(node,context){
        let res = new RuntimeResult();
        let varName = node.token.value;
        let value = context.symbols[varName];
        if(!value){
            return res.failure(new RuntimeError(`Undefined variable '${varName}'`, node.posStart, node.posEnd, context));
        }
        value = value.copy().setPos(node.posStart, node.posEnd);
        return res.success(value);
    }

    visit_VarAssignmentNode(node,context){
        let res = new RuntimeResult();
        let varName = node.token.value;
        let value = res.register(this.visit(node.valueNode,context));
        if(res.error) return res;
        // if(varName in context.symbols){
        //     return res.failure(new RuntimeError(`Variable '${varName}' is already defined`, node.posStart, node.posEnd, context));
        // }
        context.symbols[varName] = value;
        return res.success(value);
    }

    visit_StringNode(node, context){
        return new RuntimeResult().success(new String(node.value).setPos(node.posStart, node.posEnd).setContext(context));
    }

    visit_BooleanNode(node, context){
        return new RuntimeResult().success(new Boolean(node.value).setPos(node.posStart, node.posEnd).setContext(context));
    }

    visit_ExecNode(node, context){
        if(node.command === 'clear')
            console.clear();
        return new RuntimeResult().success(new Undefined().setPos(node.posStart, node.posEnd).setContext(context));
    }

    visit_UndefinedNode(node, context){
        return new RuntimeResult().success(new Undefined().setPos(node.posStart, node.posEnd).setContext(context));
    }

    visit_IfNode(node, context){
        let res = new RuntimeResult();
        for( let [condition, expression] of node.cases){
            let conditionResult = res.register(this.visit(condition,context));
            if(res.error) return res;
            if(conditionResult.isTrue()){
                let expressionResult = res.register(this.visit(expression,context));
                if(res.error) return res;
                return res.success(expressionResult);
            }
        }
        if(node.elseCase){
            let elseResult = res.register(this.visit(node.elseCase,context));
            if(res.error) return res;
            return res.success(elseResult);
        }

        return new RuntimeResult().success(new Undefined().setPos(node.posStart, node.posEnd).setContext(context));
    }

    visit_ForNode(node, context){
        let res = new RuntimeResult();
        let result = new RuntimeResult();
        let start = res.register(this.visit(node.startNode,context));
        if(res.error) return res;
        let end = res.register(this.visit(node.endNode,context));
        if(res.error) return res;
        let step = new Number(1);
        if(node.step){
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

    visit_WhileNode(node, context){
        let res = new RuntimeResult();
        let result = new RuntimeResult();

        while(res.register(this.visit(node.conditionNode,context)).isTrue()){
            let expressionResult = res.register(this.visit(node.bodyNode.setPos(),context));
            if(res.error) return res;
            result = expressionResult;
        }
        return result;
    }
}

module.exports = { Interpreter };