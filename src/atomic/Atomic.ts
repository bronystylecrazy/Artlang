import Context from "../context/Context";
import Position from "../lexer/Position";
import Boolean from "./Boolean";
import Number from "./Number";
import String from "./String";
import Undefined from "./Undefined";

class Atomic{
    constructor(
        public value: any,
        public posStart: Position,
        public posEnd: Position,
        public context: Context
    ){
        this.setContext(context);
    }

    copy(){
        return new (<typeof Atomic>this.constructor)(this.value, this.posStart, this.posEnd,this.context);
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

    isTrue(){
        return !!this.value;
    }

    toString(){
        return this.value.toString();
    }
}

export default Atomic;