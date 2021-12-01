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

    makeTokens(type){
        let tokens = [];
        while(this.currentChar != null){
            if(' \t\n\r'.includes(this.currentChar)){
                this.advance();
                continue;
            }
            if(this.currentChar == '+'){
                tokens.push(new Token(TT_PLUS,undefined,this.pos));
                this.advance();
                continue;
            }
            if(this.currentChar == '-'){
                tokens.push(new Token(TT_MINUS,undefined,this.pos));
                this.advance();
                continue;
            }
            if(this.currentChar == '*'){
                let originPos = this.pos.copy();
                this.advance();
                if(this.currentChar == '*'){
                    tokens.push(new Token(TT_POW,undefined,originPos, this.pos));
                    this.advance();
                    continue;
                }else{
                    tokens.push(new Token(TT_MUL,undefined,originPos));
                    continue;
                }
            }
            if(this.currentChar == '/'){
                tokens.push(new Token(TT_DIV,undefined,this.pos));
                this.advance();
                continue;
            }
            if(this.currentChar == '('){
                tokens.push(new Token(TT_LPAREN,undefined,this.pos));
                this.advance();
                continue;
            }
            if(this.currentChar == ')'){
                tokens.push(new Token(TT_RPAREN,undefined,this.pos));
                this.advance();
                continue;
            }
            if(this.currentChar == '='){
                tokens.push(new Token(TT_EQ,undefined,this.pos));
                this.advance();
                continue;
            }

            if(this.currentChar == ';'){
                tokens.push(new Token(TT_END,undefined,this.pos));
                this.advance();
                continue;
            }

            if(this.currentChar == '"' || this.currentChar == "'"){
                tokens.push(this.makeString());
                continue;
            }

            if(DIGIT.includes(this.currentChar)){
                tokens.push(this.makeNumber());
                continue;
            }
            if((LETTERS+'_').includes(this.currentChar)){
                tokens.push(this.makeIdentifier());
                continue;
            }

            let char = this.currentChar;
            let posStart = this.pos.copy();
            this.advance();
            console.error(new IllegalCharacterError(`'${char}'`,posStart, this.pos).toString());
            return undefined;
        }
        tokens.push(new Token(TT_EOF,undefined,this.pos));
        return tokens;
    }
    makeNumber(){
        let number = '';
        let posStart = this.pos.copy();
        let dotCount = 0;

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
        if(dotCount == 0){
            return new Token(TT_INT, parseInt(number), posStart, this.pos);
        }
        return new Token(TT_FLOAT, parseFloat(number), posStart, this.pos);
    }
    makeIdentifier(){
        let identifier = '';
        let posStart = this.pos.copy();
        while(this.currentChar != null && (LETTER_DIGIT+'_').includes(this.currentChar)){
            identifier += this.currentChar;
            this.advance();
        }
        let tokenType = KEYWORDS.includes(identifier) ? TT_KEYWORD : TT_IDENTIFIER;
        return new Token(tokenType, identifier, posStart, this.pos);
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
            throw new IllegalCharacterError(`Expected '${char}' at the end of the string`,posStart, this.pos).toString();
        }
        this.advance();
        return new Token(TT_STRING, string, posStart, this.pos);
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