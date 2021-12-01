const { RuntimeResult } = require("./Result");
const { Context } = require("./Context");
const { RuntimeError } = require("./Error");

class Object{
    constructor(value, posStart, posEnd,context){
        this.value = value;
        this.posStart = posStart;
        this.posEnd = posEnd;
        this.setContext(context);
    }

    copy(Type){
        if(typeof Type === 'undefined') Type = this.constructor;
        return new Type(this.value, this.posStart, this.posEnd).setContext(this.context);
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
    toString(){
        return this.value.toString();
    }
}

class String extends Object{
    constructor(value, posStart, posEnd,context,...rest){
        super(value, posStart, posEnd,context,...rest);
    }
    setPos(posStart, posEnd){
        this.posStart = posStart;
        this.posEnd = posEnd;
        return this;
    }
    setContext(context){
        this.context = context;
        return this;
    }
    add(other){
        if(other instanceof String){
            return new RuntimeResult().success(new String(this.value + other.value).setContext(this.context));
        }
        if(other instanceof Number){
            return new RuntimeResult().success(new String(this.value + ''+other.value).setContext(this.context));
        }
    }
    mul(other){
        if(other instanceof Number){
            let value = [...Array(other.value)].reduce(c => c + this.value,'');
            return new RuntimeResult().success(new String(value).setContext(this.context));
        }
    }
    toString(){
        return `"${this.value.toString()}"`;
    }

    copy(){
        super.copy(Number);
    }
}



class Number extends Object{
    constructor(value, posStart, posEnd,context,...rest){
        super(value, posStart, posEnd,context,...rest);
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
        if(other instanceof String){
            if(other.value == parseInt(other.value)){
                return new RuntimeResult().success(new Number(this.value + other.value).setContext(this.context));
            }else{
                return new RuntimeResult().success(new String(this.value + other.value).setContext(this.context));
            }
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

    pow(other){
        if(other instanceof Number){
            return new RuntimeResult().success(new Number(Math.pow(this.value, other.value)).setContext(this.context));
        }
    }

    toString(){
        return this.value.toString();
    }
}

module.exports = {
    String,
    Number,
    Object
}