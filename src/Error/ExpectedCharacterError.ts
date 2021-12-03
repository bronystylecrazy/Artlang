import Context from "../Context/Context";
import Position from "../Lexer/Position";
import Error from "./ErrorBase";

class ExpectedCharacterError extends Error{
    constructor(public message: string, public posStart?: Position, public posEnd?: Position,public context?: Context){
        super("ExpectedCharacterError", message, posStart, posEnd,context);
    }
}

export default ExpectedCharacterError;