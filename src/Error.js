const colors = require('colors');

const repeatStr = (count, char) => {
    return [...Array(count)].reduce(c => c + char,'')
}

const stringWithArrows = (text, posStart, posEnd) => {
    let result = '';
    let idx_start = Math.max(0, text.slice(posStart.idx).lastIndexOf('\n', ));
    let idx_end = text.indexOf('\n', idx_start+1);
    if(idx_end < 0) idx_end = text.length;

    let lineCount = posEnd.line - posStart.line + 1;
    for(let i = 0; i < lineCount; i++){
        let line = text.slice(idx_start, idx_end);
        let columnStart = i == 0 ?  posStart.column : 0;
        let columnEnd = i == lineCount - 1 ? posEnd.column : line.length-1;
        result += line + '\n';
        result += repeatStr(columnStart, ' ') + repeatStr(Math.abs(columnEnd - columnStart), '^');
        idx_start = idx_end;
        idx_end = text.indexOf('\n', idx_start+1);
        if(idx_end < 0) idx_end = text.length;
    }
    return result.replace(/\t$/,'');
}

class Error{
    constructor(name, message, posStart, posEnd, context){
        this.name = name;
        this.message = message;
        this.posStart = posStart;
        this.posEnd = posEnd;
        this.context = context;
    }
    toString(){
        let result = `${this.name}: ${this.message}`;
        result += "\n";
        result += `${stringWithArrows(this.posStart?.fileText,this.posStart, this.posEnd)}`;
        result += `\n    at ${this.posStart?.fileName}, Line: ${this.posStart?.line + 1}, Column: ${this.posStart?.column + 1}`;
        return result.red;
    }
}

class IllegalCharacterError extends Error{
    constructor(message, posStart, posEnd,...rest){
        super("IllegalCharacterError", message, posStart, posEnd,...rest);
    }
}

class ExpectedCharacterError extends Error{
    constructor(message, posStart, posEnd,...rest){
        super("ExpectedCharacterError", message, posStart, posEnd,...rest);
    }
}


class InvalidSyntaxError extends Error{
    constructor(message, posStart, posEnd,...rest){
        super("InvalidSyntaxError", message, posStart, posEnd,...rest);
    }
}

class RuntimeError extends Error{
    constructor(message, posStart, posEnd,...rest){
        super("RuntimeError", message, posStart, posEnd,...rest);
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
        return result.red;
    }
}

module.exports = {
    Error,
    IllegalCharacterError,
    InvalidSyntaxError,
    RuntimeError,
    ExpectedCharacterError
}