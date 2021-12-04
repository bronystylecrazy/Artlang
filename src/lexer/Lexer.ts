import { DIGIT, KEYWORDS, LETTERS, LETTER_DIGIT, TokenType } from '../constants';
import IllegalCharacterError from '../error/IllegalCharacterError';
import LexerResult from '../result/LexerResult';
import TokenResult from '../result/TokenResult';
import Position from './Position';
import Token from './Token';

class Lexer{

    pos: Position;
    currentChar: string|null;

    constructor(public text?: string, public fileName?: string){
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

    build({ save=false, fileName= 'tokens.json'}): LexerResult {
        let tokens: Token[] = [];

        while(this.currentChar != null){
            if(' \t\n\r'.includes(this.currentChar)){
                this.advance();
            } else if(this.currentChar == '+'){
                tokens.push(new Token(TokenType.PLUS,undefined,this.pos.copy()));
                this.advance();
            }else if(this.currentChar == '-'){
                const { token, error } = this.makeMinusOrArrow();
                if(error) return new LexerResult(error);
                tokens.push(token);
            }else if(this.currentChar == '*'){
                const {token, error} = this.makePower();
                if(error) return new LexerResult(error);
                tokens.push(token);
            }else if(this.currentChar == '/'){
                tokens.push(new Token(TokenType.DIV,undefined,this.pos.copy()));
                this.advance();
            }else if(this.currentChar == '('){
                tokens.push(new Token(TokenType.LPAREN,undefined,this.pos.copy()));
                this.advance();
            }else if(this.currentChar == ')'){
                tokens.push(new Token(TokenType.RPAREN,undefined,this.pos.copy()));
                this.advance();
            }else if(this.currentChar == ';'){
                tokens.push(new Token(TokenType.END,undefined,this.pos.copy()));
                this.advance();
            }else if(this.currentChar == '"' || this.currentChar == "'"){
                const {token, error} = this.makeString();
                if(error) return new LexerResult(error);
                tokens.push(token);
            }else if(this.currentChar == ','){
                tokens.push(new Token(TokenType.COMMA,undefined,this.pos.copy()));
                this.advance();
            }else if(this.currentChar == '!'){
                const {token, error} = this.makeNot();
                if(error) return new LexerResult(error);
                tokens.push(token);
            }else if(this.currentChar == '='){
                const {token, error} = this.makeEqualOrArrow();
                if(error) return new LexerResult(error);
                tokens.push(token);
            }else if(this.currentChar == '>'){
                const {token, error} = this.makeGreaterThan();
                if(error) return new LexerResult(error);
                tokens.push(token);
            }else if(this.currentChar == '<'){
                const {token, error} = this.makeLessThan();
                if(error) return new LexerResult(error);
                tokens.push(token);
            }else if(this.currentChar == '|'){
                const {token, error} = this.makeOr();
                if(error) return new LexerResult(error);
                tokens.push(token);
            }else if(this.currentChar == '&'){
                const {token, error} = this.makeAnd();
                if(error) return new LexerResult(error);
                tokens.push(token);
            }
            else if(DIGIT.includes(this.currentChar)){
                const {token, error} = this.makeNumber();
                if(error) return new LexerResult(error);
                tokens.push(token);
            }else if((LETTERS+'_').includes(this.currentChar)){
                const {token, error} = this.makeIdentifier();
                if(error) return new LexerResult(error);
                tokens.push(token);
            }else{
                let char = this.currentChar;
                let posStart = this.pos.copy();
                this.advance();
                return new LexerResult(new IllegalCharacterError(`'${char}'`,posStart, this.pos.copy()));
            }
        }
        tokens.push(new Token(TokenType.EOF,undefined,this.pos.copy()));
        if(save) this.saveTokens(tokens, fileName);
        return new LexerResult(tokens);
    }

    makeMinusOrArrow(){
        let tokenType = TokenType.MINUS;
        let originPos = this.pos.copy();
        this.advance();

        if(this.currentChar == '>') tokenType = TokenType.ARROW;

        return new TokenResult(new Token(tokenType,undefined,originPos,this.pos.copy()));
        this.advance();
    }

    makePower(){
        let originPos = this.pos.copy();
        this.advance();
        if(this.currentChar == '*'){
            this.advance();
            return new TokenResult(new Token(TokenType.POW,undefined,originPos, this.pos.copy()));
        }else{
            return new TokenResult(new Token(TokenType.MUL,undefined,originPos));
        }
    }

    makeNumber(){
        let number = '';
        let posStart = this.pos.copy();
        let dotCount = 0;
        let isBased = false;
        if(this.currentChar == '0'){
            number += this.currentChar;
            this.advance();
            if(this.currentChar != null && ['b','x'].includes(this.currentChar.toLowerCase())){
                isBased = true;
                number += `${this.currentChar}`;
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
            return new TokenResult( new Token(TokenType.INT, +number, posStart, this.pos.copy()) );
        }else if(dotCount > 1){
            return new TokenResult( new IllegalCharacterError(`'.'`,posStart, this.pos.copy()) );
        }

        return new TokenResult( new Token(TokenType.FLOAT, parseFloat(number), posStart, this.pos.copy()) );
    }

    makeIdentifier(): TokenResult{
        let identifier = '';
        let posStart = this.pos.copy();
        while(this.currentChar != null && (LETTER_DIGIT+'_').includes(this.currentChar)){
            identifier += this.currentChar;
            this.advance();
        }
        let tokenType = KEYWORDS.includes(identifier) ? TokenType.KEYWORD : TokenType.IDENTIFIER;
        const identifierToken = new Token(tokenType, identifier, posStart, this.pos.copy());

        return new TokenResult(identifierToken);
    }

    makeString(): TokenResult{
        let string = '';
        let posStart = this.pos.copy();
        var char = this.currentChar;
        this.advance();
        while(this.currentChar != null && this.currentChar != char){
            string += this.currentChar;
            this.advance();
        }
        if(this.currentChar != char){
            return new TokenResult(new IllegalCharacterError(`Expected '${char}' at the end of the string`,posStart, this.pos.copy()));
        }
        this.advance();
        return new TokenResult( new Token(TokenType.STRING, string, posStart, this.pos.copy()) );
    }

    makeNot(){
        let posStart = this.pos.copy();
        this.advance();
        if(this.currentChar == '='){
            this.advance();
            return new TokenResult( new Token(TokenType.NEQ, undefined, posStart, this.pos.copy()));
        }
        return new TokenResult( new Token(TokenType.NOT, undefined, posStart, this.pos.copy()));
    }
    makeEqualOrArrow(){
        let posStart = this.pos.copy();
        this.advance();
        if(this.currentChar == '='){
            this.advance();
            return new TokenResult( new Token(TokenType.EEQ, undefined, posStart, this.pos.copy()));
        }
        
        if(this.currentChar == '>'){
            this.advance();
            return new TokenResult( new Token(TokenType.ARROW, undefined, posStart, this.pos.copy()));
        }

        return new TokenResult( new Token(TokenType.EQ, undefined, posStart, this.pos.copy()));
    }

    makeLessThan(){
        let posStart = this.pos.copy();
        this.advance();
        if(this.currentChar == '='){
            this.advance();
            return new TokenResult( new Token(TokenType.LTE, undefined, posStart, this.pos.copy()));
        }
        return new TokenResult( new Token(TokenType.LT, undefined, posStart, this.pos.copy()));
    }

    makeGreaterThan(){
        let posStart = this.pos.copy();
        this.advance();
        if(this.currentChar == '='){
            this.advance();
            return new TokenResult( new Token(TokenType.GTE, undefined, posStart, this.pos.copy()));
        }
        return new TokenResult( new Token(TokenType.GT, undefined, posStart, this.pos.copy()));
    }

    makeAnd(){
        let posStart = this.pos.copy();
        this.advance();
        if(this.currentChar == '&'){
            this.advance();
            return new TokenResult( new Token(TokenType.LAND, undefined, posStart, this.pos.copy()));
        }
        return new TokenResult( new Token(TokenType.AND, undefined, posStart, this.pos.copy()));
    }

    makeOr(){
        let posStart = this.pos.copy();
        this.advance();
        if(this.currentChar == '|'){
            this.advance();
            return new TokenResult( new Token(TokenType.LOR, undefined, posStart, this.pos.copy()));
        }
        return new TokenResult( new Token(TokenType.OR, undefined, posStart, this.pos.copy()));
    }

    saveTokens(tokens,fileName){
        require('fs').writeFileSync(fileName, JSON.stringify(tokens,null,2));
    }
}

export default Lexer;