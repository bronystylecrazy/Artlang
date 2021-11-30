const colors = require('colors');
class Error{
    constructor(name, message, posStart, posEnd){
        this.name = name;
        this.message = message;
        this.posStart = posStart;
        this.posEnd = posEnd;
    }
    toString(){
        let result = `${this.name}: ${this.message}`;
        result += `\n    at ${this.posStart?.fileName}, Line: ${this.posStart?.line}, Column: ${this.posStart?.column}`;
        return result.red;
    }
}

class IllegalCharacterError extends Error{
    constructor(message, posStart, posEnd,...rest){
        super("IllegalCharacterError", message, posStart, posEnd,...rest);
    }
}


class InvalidSyntaxError extends Error{
    constructor(message, posStart, posEnd,...rest){
        super("InvalidSyntaxError", message, posStart, posEnd,...rest);
    }
}

module.exports = {
    Error,
    IllegalCharacterError,
    InvalidSyntaxError
}