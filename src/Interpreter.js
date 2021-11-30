const colors = require('colors');
const e = require('express');
const { TT_PLUS, TT_MUL, TT_MINUS, TT_DIV } = require('./Contants');
const { RuntimeError } = require('./Error');
const { Node } = require('./Node');
const { ParseResult } = require('./Parser');
const { RuntimeResult } = require('./Result');

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
        if(right.error)
            return res.failure(right.error);
        right = right.value;
        
        return right.setPos(node.posStart, node.posEnd);
    }
}

class Number{
    constructor(value){
        this.value = value;
        this.setContext();
        this.setPos();
    }
    setContext(context){
        this.context = context;
        return this;
    }

    setPos(posStart, posEnd){
        this.posStart = posStart;
        this.posEnd = posEnd;
        return this;
    }

    add(other){
        if(other instanceof Number){
            return new RuntimeResult().success(new Number(this.value + other.value).setContext(this.context));
        }
    }
    sub(other){
        if(other instanceof Number){
            return new RuntimeResult().success(new Number(this.value - other.value).setContext(this.context));
        }
    }
    mul(other){
        if(other instanceof Number){
            return new RuntimeResult().success(new Number(this.value * other.value).setContext(this.context));
        }
    }
    div(other){
        if(other instanceof Number){
            if(other.value == 0){
                return new RuntimeResult().failure(
                    new RuntimeError('Division by zero', other.posStart, other.posEnd, this.context).toString()
                );
            }
            return new RuntimeResult().success(new Number(this.value / other.value).setContext(this.context));
        }
    }

    toString(){
        return this.value.toString();
    }
}

module.exports = {Interpreter, Number};