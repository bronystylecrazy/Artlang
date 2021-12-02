const { IllegalCharacterError } = require("./Error");
const { 
    TT_INT,
    TT_FLOAT,
    TT_PLUS,
    TT_MINUS,
    TT_MUL,
    TT_DIV,
    TT_POW,
    TT_STRING,
    TT_LPAREN,
    TT_RPAREN,
    TT_NEWLINE,
    TT_EOF,
    TT_EQ,
    DIGIT,
    LETTERS,
    LETTER_DIGIT,
    KEYWORDS,
    TT_IDENTIFIER,
    TT_KEYWORD,
    TT_END,
    TT_COMMA,
    TT_EEQ,
    TT_GT,
    TT_GTE,
    TT_LT,
    TT_LTE,
    TT_NEQ,
    TT_NOT,
    TT_LAND,
    TT_AND,
    TT_OR,
    TT_LOR
} = require("./Contants");

class Token{
    constructor(type, value, posStart, posEnd){
        this.type = type;
        this.value = value;
        if(typeof posStart !== 'undefined'){
            this.posStart = posStart.copy();
            this.posEnd = posStart.copy();
            this.posEnd.advance();
        }
        if(typeof posEnd  !== 'undefined'){
            this.posEnd = posEnd;
        }
    }

    matches(type, value){
        return this.type === type &&
            (typeof value === 'undefined' || this.value === value);
    }

    toString(){
        if(typeof this.value === 'undefined')
            return this.type;
        return `${this.type}:${this.value}`;
    }
}

class Lexer{
    constructor(text, fileName){
        this.text = text;
        this.pos = new Position(-1,0,-1,fileName, text);
        this.currentChar = null;
        this.advance(); 
    }

    advance(){
        this.pos.advance(this.currentChar);
        if(this.pos.idx > this.text.length - 1){
            this.currentChar = null;
        }else{
            this.currentChar = this.text[this.pos.idx];
        }
    }

    makeTokens({ save=false, fileName= 'tokens.json'}){
        let tokens = [];
        while(this.currentChar != null){
            if(' \t\n\r'.includes(this.currentChar)){
                this.advance();
            } else if(this.currentChar == '+'){
                tokens.push(new Token(TT_PLUS,undefined,this.pos.copy()));
                this.advance();
            }else if(this.currentChar == '-'){
                tokens.push(new Token(TT_MINUS,undefined,this.pos.copy()));
                this.advance();
            }else if(this.currentChar == '*'){
                const [powerToken, error] = this.makePower();
                if(error) return [,error];
                tokens.push(powerToken);
            }else if(this.currentChar == '/'){
                tokens.push(new Token(TT_DIV,undefined,this.pos.copy()));
                this.advance();
            }else if(this.currentChar == '('){
                tokens.push(new Token(TT_LPAREN,undefined,this.pos.copy()));
                this.advance();
            }else if(this.currentChar == ')'){
                tokens.push(new Token(TT_RPAREN,undefined,this.pos.copy()));
                this.advance();
            }else if(this.currentChar == ';'){
                tokens.push(new Token(TT_END,undefined,this.pos.copy()));
                this.advance();
            }else if(this.currentChar == '"' || this.currentChar == "'"){
                const [stringToken, error] = this.makeString();
                if(error) return [,error];
                tokens.push(stringToken);
            }else if(this.currentChar == ','){
                tokens.push(new Token(TT_COMMA,undefined,this.pos.copy()));
            }else if(this.currentChar == '!'){
                const [notToken, error] = this.makeNot();
                if(error) return [,error];
                tokens.push(notToken);
            }else if(this.currentChar == '='){
                const [eqToken,error] = this.makeEquals();
                if(error) return [,error];
                tokens.push(eqToken);
            }else if(this.currentChar == '>'){
                const [gtToken,error] = this.makeGreaterThan();
                if(error) return [,error];
                tokens.push(gtToken);
            }else if(this.currentChar == '<'){
                const [ltToken,error] = this.makeLessThan();
                if(error) return [,error];
                tokens.push(ltToken);
            }else if(this.currentChar == '|'){
                const [orToken,error] = this.makeOr();
                if(error) return [,error];
                tokens.push(orToken);
            }else if(this.currentChar == '&'){
                const [andToken,error] = this.makeAnd();
                if(error) return [,error];
                tokens.push(andToken);
            }
            else if(DIGIT.includes(this.currentChar)){
                const [numberToken, error] = this.makeNumber();
                if(error) return [,error];
                tokens.push(numberToken);
            }else if((LETTERS+'_').includes(this.currentChar)){
                const [identifierToken, error] = this.makeIdentifier();
                if(error) return [,error];
                tokens.push(identifierToken);
            }else{
                let char = this.currentChar;
                let posStart = this.pos.copy();
                this.advance();
                return [, new IllegalCharacterError(`'${char}'`,posStart, this.pos.copy()).toString()];
            }
        }
        tokens.push(new Token(TT_EOF,undefined,this.pos.copy()));
        if(save) this.saveTokens(tokens, fileName);
        return [tokens];
    }

    makePower(){
        let originPos = this.pos.copy();
        this.advance();
        if(this.currentChar == '*'){
            this.advance();
            return [new Token(TT_POW,undefined,originPos, this.pos.copy())];
        }else{
            return [new Token(TT_MUL,undefined,originPos)];
        }
    }

    makeNumber(){
        let number = '';
        let posStart = this.pos.copy();
        let dotCount = 0;
        let isBased = false;
        if(this.currentChar == '0'){
            this.advance();
            if(this.currentChar != null && ['b','x'].includes(this.currentChar.toLowerCase())){
                isBased = true;
                number += `0${this.currentChar}`;
                this.advance();
            }
        }
        if(isBased){
            while(DIGIT.includes(this.currentChar)){
                number += this.currentChar;
                this.advance();
            }
        }else{
            while(this.currentChar != null && (DIGIT+'.').includes(this.currentChar)){
                if(this.currentChar == '.'){
                    if(dotCount == 1) break;
                    dotCount++;
                    number += '.';
                }else{
                    number += this.currentChar;
                }
                this.advance();
            }
        }

        if(dotCount == 0){
            return [new Token(TT_INT, +number, posStart, this.pos.copy())];
        }
        
        return [new Token(TT_FLOAT, parseFloat(number), posStart, this.pos.copy())];
    }

    makeIdentifier(){
        let identifier = '';
        let posStart = this.pos.copy();
        while(this.currentChar != null && (LETTER_DIGIT+'_').includes(this.currentChar)){
            identifier += this.currentChar;
            this.advance();
        }
        let tokenType = KEYWORDS.includes(identifier) ? TT_KEYWORD : TT_IDENTIFIER;
        const identifierToken = new Token(tokenType, identifier, posStart, this.pos.copy());
        return [identifierToken];
    }

    makeString(){
        let string = '';
        let posStart = this.pos.copy();
        var char = this.currentChar;
        this.advance();
        while(this.currentChar != null && this.currentChar != char){
            string += this.currentChar;
            this.advance();
        }
        if(this.currentChar != char){
            return [,IllegalCharacterError(`Expected '${char}' at the end of the string`,posStart, this.pos.copy()).toString()];
        }
        this.advance();
        return [new Token(TT_STRING, string, posStart, this.pos.copy())];
    }
    makeNot(){
        let posStart = this.pos.copy();
        this.advance();
        if(this.currentChar == '='){
            this.advance();
            return [new Token(TT_NEQ, undefined, posStart, this.pos.copy())];
        }
        return [new Token(TT_NOT, undefined, posStart, this.pos.copy())];
    }
    makeEquals(){
        let posStart = this.pos.copy();
        this.advance();
        if(this.currentChar == '='){
            this.advance();
            return [new Token(TT_EEQ, undefined, posStart, this.pos.copy())];
        }
        return [new Token(TT_EQ, undefined, posStart, this.pos.copy())];
    }

    makeLessThan(){
        let posStart = this.pos.copy();
        this.advance();
        if(this.currentChar == '='){
            this.advance();
            return [new Token(TT_LTE, undefined, posStart, this.pos.copy())];
        }
        return [new Token(TT_LT, undefined, posStart, this.pos.copy())];
    }

    makeGreaterThan(){
        let posStart = this.pos.copy();
        this.advance();
        if(this.currentChar == '='){
            this.advance();
            return [new Token(TT_GTE, undefined, posStart, this.pos.copy())];
        }
        return [new Token(TT_GT, undefined, posStart, this.pos.copy())];
    }

    makeAnd(){
        let posStart = this.pos.copy();
        this.advance();
        if(this.currentChar == '&'){
            this.advance();
            return [new Token(TT_LAND, undefined, posStart, this.pos.copy())];
        }
        return [new Token(TT_AND, undefined, posStart, this.pos.copy())];
    }

    makeOr(){
        let posStart = this.pos.copy();
        this.advance();
        if(this.currentChar == '|'){
            this.advance();
            return [new Token(TT_LOR, undefined, posStart, this.pos.copy())];
        }
        return [new Token(TT_OR, undefined, posStart, this.pos.copy())];
    }
    saveTokens(tokens,fileName){
        require('fs').writeFileSync(fileName, JSON.stringify(tokens,null,2));
    }
}

class Position{
    constructor(idx, line, column, fileName, fileText){
        this.idx = idx;
        this.line = line;
        this.column = column;
        this.fileName = fileName;
        this.fileText = fileText;
    }
    advance(currentChar){
        this.idx++;
        this.column++;
        if(currentChar == '\n'){
            this.line++;
            this.column = 0;
        }
        return this;
    }
    copy(){
        return new Position(this.idx, this.line, this.column, this.fileName, this.fileText);
    }
}

module.exports = {Lexer, Token, Position};