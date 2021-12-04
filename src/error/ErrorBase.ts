import Context from "../context/Context";
import Position from "../lexer/Position";
import stringWithArrows from "../utils/stringWithArrows";

class Error{
    constructor(
        public name?: string,
        public message?: string,
        public posStart?: Position,
        public posEnd?: Position,
        public context?: Context){
        this.name = name || "UnknownError";
        this.message = message || "Something went wrong";
        this.posStart = posStart;
        this.posEnd = posEnd;
        this.context = context;
    }

    toString(){
        let result = `${this.name}: ${this.message}\n`;
        result += "\n";
        result += `${stringWithArrows(this.posStart?.fileText,this.posStart, this.posEnd)}`;
        result += `\n    at ${this.posStart?.fileName}, Line: ${this.posStart?.line + 1}, Column: ${this.posStart?.column + 1}`;
        return result;
    }
}

export default Error;