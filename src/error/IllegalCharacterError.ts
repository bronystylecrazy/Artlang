import Context from "../context/Context";
import Position from "../lexer/Position";
import Error from "./ErrorBase";

class IllegalCharacterError extends Error{
    constructor(public message: string, public posStart?: Position, public posEnd?: Position,public context?: Context){
        super("IllegalCharacterError", message, posStart, posEnd,context);
    }
}

export default IllegalCharacterError;