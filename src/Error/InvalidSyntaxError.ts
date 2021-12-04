
import Context from "../context/Context";
import Position from "../lexer/Position";
import Error from "./ErrorBase";

class InvalidSyntaxError extends Error{
    constructor(public message: string, public posStart?: Position, public posEnd?: Position,public context?: Context){
        super("InvalidSyntaxError", message, posStart, posEnd,context);
    }
}

export default InvalidSyntaxError;