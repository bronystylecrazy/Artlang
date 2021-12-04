import RuntimeError from "../error/RuntimeError";
import RuntimeResult from "../result/RuntimeResult";
import Context from "../context/Context";
import Position from "../lexer/Position";
import Atomic from "./Atomic";
import Boolean from "./Boolean";
import Number from "./Number";
import Undefined from "./Undefined";

class String extends Atomic{
    constructor(value: string, posStart?: Position, posEnd?: Position,context?: Context){
        super(value, posStart, posEnd,context);
    }

    add(other){
        if(other instanceof String){
            return new String(this.value + other.value).setContext(this.context);
        }
        if(other instanceof Number){
            return new String(this.value + ''+other.value).setContext(this.context);
        }
    }

    sub(other){
        if(other instanceof Number || other instanceof String){
            return new Number(this.value - other.value).setContext(this.context);
        }
    }

    div(other){
        if(other instanceof Number || other instanceof String){
            if(other.value == 0){
                return new RuntimeError('Division by zero', other.posStart, other.posEnd, this.context);
            }
            return new Number(this.value / other.value).setContext(this.context);
        }
    }

    mul(other){
        if(other instanceof Number){
            if(other.value >= 0){
                let value = [...Array(other.value)].reduce(c => c + this.value,'');
                return new String(value).setContext(this.context);
            }else{
                return new Undefined();
            }
        }

    }
    pow(other){
        if(other instanceof Number || other instanceof String){
            return new Number(Math.pow(this.value, other.value)).setContext(this.context);
        }
    }

    equals(other){
        if(other instanceof Number || other instanceof String){
            return new Boolean(this.value == other.value).setContext(this.context);
        }
    }
    notEquals(other){
        if(other instanceof Number || other instanceof String){
            return new Boolean(this.value != other.value).setContext(this.context);
        }
    }

    lessThan(other){
        if(other instanceof Number || other instanceof String){
            return new Boolean(this.value < other.value).setContext(this.context);
        }
    }

    greaterThan(other){
        if(other instanceof Number  || other instanceof String){
            return new Boolean(this.value > other.value).setContext(this.context);
        }
    }
    lessThanOrEqual(other){
        if(other instanceof Number || other instanceof String){
            return new Boolean(this.value <= other.value).setContext(this.context);
        }
    }

    greaterThanOrEqual(other){
        if(other instanceof Number || other instanceof String){
            return new Boolean(this.value >= other.value).setContext(this.context);
        }
    }

    isTrue(){
        return this.value.length > 0;
    }

    toString(){
        return `"${this.value.toString()}"`;
    }
}

export default String;