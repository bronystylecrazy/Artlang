const { IllegalCharacterError } = require("./Error");
const { 
    TT_INT,
    TT_FLOAT,
    TT_PLUS,
    TT_MINUS,
    TT_MUL,
    TT_DIV,
    TT_LPAREN,
    TT_RPAREN,
    DIGIT 
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
            if(' \t'.includes(this.currentChar)){
                this.advance();
                continue;
            }
            if(this.currentChar == '+'){
                tokens.push(new Token(TT_PLUS));
                this.advance();
                continue;
            }
            if(this.currentChar == '-'){
                tokens.push(new Token(TT_MINUS));
                this.advance();
                continue;
            }
            if(this.currentChar == '*'){
                tokens.push(new Token(TT_MUL));
                this.advance();
                continue;
            }
            if(this.currentChar == '/'){
                tokens.push(new Token(TT_DIV));
                this.advance();
                continue;
            }
            if(this.currentChar == '('){
                tokens.push(new Token(TT_LPAREN));
                this.advance();
                continue;
            }
            if(this.currentChar == ')'){
                tokens.push(new Token(TT_RPAREN));
                this.advance();
                continue;
            }
            if(DIGIT.includes(this.currentChar)){
                tokens.push(this.makeNumber());
                continue;
            }
            let char = this.currentChar;
            let posStart = this.pos.copy();
            this.advance();
            console.error( new IllegalCharacterError(`'${char}'`,posStart, this.pos).toString());
            process.exit(1);
            return [];
        }
        return tokens;
    }
    makeNumber(){
        let number = '';
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
            return new Token(TT_INT, parseInt(number));
        }
        return new Token(TT_FLOAT, parseFloat(number));
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

module.exports = Lexer;