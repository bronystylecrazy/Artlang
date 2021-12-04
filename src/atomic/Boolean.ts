import Context from "../context/Context";
import Position from "../lexer/Position";
import Atomic from "./Atomic";

class Boolean extends Atomic{
    constructor(value: boolean,posStart?: Position, posEnd?: Position,context?: Context){
        super(value, posStart, posEnd,context);
    }

    isTrue(){
        return this.value == true;
    }

    toString(){
        return this.value.toString();
    }
}

export default Boolean;