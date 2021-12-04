import Context from "../context/Context";
import Position from "../lexer/Position";
import Atomic from "./Atomic";

class Undefined extends Atomic{
    constructor(posStart?: Position, posEnd?: Position, context?: Context){
        super('undefined', posStart, posEnd,context);
    }

    isTrue(){
        return false;
    }

    toString(){
        return 'undefined';
    }
}

export default Undefined;