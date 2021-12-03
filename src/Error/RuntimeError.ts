import Context from "../Context/ContextBase";
import Position from "../Lexer/Position";
import stringWithArrows from "../utils/stringWithArrows";
import Error from "./ErrorBase";

class RuntimeError extends Error{

    constructor(public message: string, public posStart?: Position, public posEnd?: Position,public context?: Context){
        super("RuntimeError", message, posStart, posEnd, context);
    }

    generateStacktrace(body){
        let result = ``;
        let ctx = this.context;
        let position = this.posStart;
        while(ctx){
            result = `    at ${position.fileName}, Line: ${position.line+1}, Column: ${position.column+1} in ${ctx.displayName}\n` + result;
            ctx = ctx?.parent;
            position = ctx?.parentEntryPosition;
        }
        return `Traceback from these stackframes:\n\n${body}\n${this.name}: ${this.message}\n` + result;
    }
    toString(){
        let result = ``;
        result += this.generateStacktrace(stringWithArrows(this.posStart?.fileText,this.posStart, this.posEnd));
        return result;
    }
}

export default RuntimeError;