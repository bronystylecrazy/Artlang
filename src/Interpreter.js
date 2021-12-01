const colors = require('colors');
const { TT_PLUS, TT_MUL, TT_MINUS, TT_DIV, TT_POW } = require('./Contants');
const { RuntimeError } = require('./Error');
const { ParseResult } = require('./Parser');
const { RuntimeResult } = require('./Result');
const { Number, String } = require('./Atomic');

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
        throw new Error('No visit_'+node.constructor.name + ' method defined');
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
            result = left.add(right);
        }else if(node.operator.type == TT_MINUS){
            result = left.sub(right);
        }else if(node.operator.type == TT_MUL){
            result = left.mul(right);
            
        }else if(node.operator.type == TT_DIV){
            result = left.div(right);
        }else if(node.operator.type == TT_POW){
            result = left.pow(right);
        }
        if(result.error)
            return res.failure(result.error.toString());
        result = result.value;
        return res.success(result.setPos(node.posStart, node.posEnd));
    }
    visit_UnaryOperatorNode(node,context){
        let res = new RuntimeResult();
        let right = res.register(this.visit(node.right),context);
        if(node.operator.type == TT_MINUS){
            right = right.mul(new Number(-1, node.posStart, node.posEnd));
        }
        if(node.operator.type == TT_PLUS){
            right = right.mul(new Number(1, node.posStart, node.posEnd));
        }
        if(right.error)
            return res.failure(right.error);
        right = right.value;
        
        return right.setPos(node.posStart, node.posEnd);
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
        if(varName in context.symbols){
            return res.failure(new RuntimeError(`Variable '${varName}' is already defined`, node.posStart, node.posEnd, context));
        }
        context.symbols[varName] = value;
        return res.success(value);
    }

    visit_StringNode(node, context){
        return new RuntimeResult().success(new String(node.value).setPos(node.posStart, node.posEnd).setContext(context));
    }
}
module.exports = {Interpreter };