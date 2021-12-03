"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const IllegalCharacterError_1 = __importDefault(require("../Error/IllegalCharacterError"));
const LexerResult_1 = __importDefault(require("../Result/LexerResult"));
const TokenResult_1 = __importDefault(require("../Result/TokenResult"));
const Position_1 = __importDefault(require("./Position"));
const Token_1 = __importDefault(require("./Token"));
class Lexer {
    constructor(text, fileName) {
        this.text = text;
        this.fileName = fileName;
        this.text = text;
        this.pos = new Position_1.default(-1, 0, -1, fileName, text);
        this.currentChar = null;
        this.advance();
    }
    advance() {
        this.pos.advance(this.currentChar);
        if (this.pos.idx > this.text.length - 1) {
            this.currentChar = null;
        }
        else {
            this.currentChar = this.text[this.pos.idx];
        }
    }
    build({ save = false, fileName = 'tokens.json' }) {
        let tokens = [];
        while (this.currentChar != null) {
            if (' \t\n\r'.includes(this.currentChar)) {
                this.advance();
            }
            else if (this.currentChar == '+') {
                tokens.push(new Token_1.default(constants_1.TokenType.PLUS, undefined, this.pos.copy()));
                this.advance();
            }
            else if (this.currentChar == '-') {
                tokens.push(new Token_1.default(constants_1.TokenType.MINUS, undefined, this.pos.copy()));
                this.advance();
            }
            else if (this.currentChar == '*') {
                const { token, error } = this.makePower();
                if (error)
                    return new LexerResult_1.default(error);
                tokens.push(token);
            }
            else if (this.currentChar == '/') {
                tokens.push(new Token_1.default(constants_1.TokenType.DIV, undefined, this.pos.copy()));
                this.advance();
            }
            else if (this.currentChar == '(') {
                tokens.push(new Token_1.default(constants_1.TokenType.LPAREN, undefined, this.pos.copy()));
                this.advance();
            }
            else if (this.currentChar == ')') {
                tokens.push(new Token_1.default(constants_1.TokenType.RPAREN, undefined, this.pos.copy()));
                this.advance();
            }
            else if (this.currentChar == ';') {
                tokens.push(new Token_1.default(constants_1.TokenType.END, undefined, this.pos.copy()));
                this.advance();
            }
            else if (this.currentChar == '"' || this.currentChar == "'") {
                const { token, error } = this.makeString();
                if (error)
                    return new LexerResult_1.default(error);
                tokens.push(token);
            }
            else if (this.currentChar == ',') {
                tokens.push(new Token_1.default(constants_1.TokenType.COMMA, undefined, this.pos.copy()));
            }
            else if (this.currentChar == '!') {
                const { token, error } = this.makeNot();
                if (error)
                    return new LexerResult_1.default(error);
                tokens.push(token);
            }
            else if (this.currentChar == '=') {
                const { token, error } = this.makeEquals();
                if (error)
                    return new LexerResult_1.default(error);
                tokens.push(token);
            }
            else if (this.currentChar == '>') {
                const { token, error } = this.makeGreaterThan();
                if (error)
                    return new LexerResult_1.default(error);
                tokens.push(token);
            }
            else if (this.currentChar == '<') {
                const { token, error } = this.makeLessThan();
                if (error)
                    return new LexerResult_1.default(error);
                tokens.push(token);
            }
            else if (this.currentChar == '|') {
                const { token, error } = this.makeOr();
                if (error)
                    return new LexerResult_1.default(error);
                tokens.push(token);
            }
            else if (this.currentChar == '&') {
                const { token, error } = this.makeAnd();
                if (error)
                    return new LexerResult_1.default(error);
                tokens.push(token);
            }
            else if (constants_1.DIGIT.includes(this.currentChar)) {
                const { token, error } = this.makeNumber();
                if (error)
                    return new LexerResult_1.default(error);
                tokens.push(token);
            }
            else if ((constants_1.LETTERS + '_').includes(this.currentChar)) {
                const { token, error } = this.makeIdentifier();
                if (error)
                    return new LexerResult_1.default(error);
                tokens.push(token);
            }
            else {
                let char = this.currentChar;
                let posStart = this.pos.copy();
                this.advance();
                return new LexerResult_1.default(new IllegalCharacterError_1.default(`'${char}'`, posStart, this.pos.copy()));
            }
        }
        tokens.push(new Token_1.default(constants_1.TokenType.EOF, undefined, this.pos.copy()));
        if (save)
            this.saveTokens(tokens, fileName);
        return new LexerResult_1.default(tokens);
    }
    makePower() {
        let originPos = this.pos.copy();
        this.advance();
        if (this.currentChar == '*') {
            this.advance();
            return new TokenResult_1.default(new Token_1.default(constants_1.TokenType.POW, undefined, originPos, this.pos.copy()));
        }
        else {
            return new TokenResult_1.default(new Token_1.default(constants_1.TokenType.MUL, undefined, originPos));
        }
    }
    makeNumber() {
        let number = '';
        let posStart = this.pos.copy();
        let dotCount = 0;
        let isBased = false;
        if (this.currentChar == '0') {
            this.advance();
            if (this.currentChar != null && ['b', 'x'].includes(this.currentChar.toLowerCase())) {
                isBased = true;
                number += `0${this.currentChar}`;
                this.advance();
            }
        }
        if (isBased) {
            while (constants_1.DIGIT.includes(this.currentChar)) {
                number += this.currentChar;
                this.advance();
            }
        }
        else {
            while (this.currentChar != null && (constants_1.DIGIT + '.').includes(this.currentChar)) {
                if (this.currentChar == '.') {
                    if (dotCount == 1)
                        break;
                    dotCount++;
                    number += '.';
                }
                else {
                    number += this.currentChar;
                }
                this.advance();
            }
        }
        if (dotCount == 0) {
            return new TokenResult_1.default(new Token_1.default(constants_1.TokenType.INT, +number, posStart, this.pos.copy()));
        }
        else if (dotCount > 1) {
            return new TokenResult_1.default(new IllegalCharacterError_1.default(`'.'`, posStart, this.pos.copy()));
        }
        return new TokenResult_1.default(new Token_1.default(constants_1.TokenType.FLOAT, parseFloat(number), posStart, this.pos.copy()));
    }
    makeIdentifier() {
        let identifier = '';
        let posStart = this.pos.copy();
        while (this.currentChar != null && (constants_1.LETTER_DIGIT + '_').includes(this.currentChar)) {
            identifier += this.currentChar;
            this.advance();
        }
        let tokenType = constants_1.KEYWORDS.includes(identifier) ? constants_1.TokenType.KEYWORD : constants_1.TokenType.IDENTIFIER;
        const identifierToken = new Token_1.default(tokenType, identifier, posStart, this.pos.copy());
        return new TokenResult_1.default(identifierToken);
    }
    makeString() {
        let string = '';
        let posStart = this.pos.copy();
        var char = this.currentChar;
        this.advance();
        while (this.currentChar != null && this.currentChar != char) {
            string += this.currentChar;
            this.advance();
        }
        if (this.currentChar != char) {
            return new TokenResult_1.default(new IllegalCharacterError_1.default(`Expected '${char}' at the end of the string`, posStart, this.pos.copy()));
        }
        this.advance();
        return new TokenResult_1.default(new Token_1.default(constants_1.TokenType.STRING, string, posStart, this.pos.copy()));
    }
    makeNot() {
        let posStart = this.pos.copy();
        this.advance();
        if (this.currentChar == '=') {
            this.advance();
            return new TokenResult_1.default(new Token_1.default(constants_1.TokenType.NEQ, undefined, posStart, this.pos.copy()));
        }
        return new TokenResult_1.default(new Token_1.default(constants_1.TokenType.NOT, undefined, posStart, this.pos.copy()));
    }
    makeEquals() {
        let posStart = this.pos.copy();
        this.advance();
        if (this.currentChar == '=') {
            this.advance();
            return new TokenResult_1.default(new Token_1.default(constants_1.TokenType.EEQ, undefined, posStart, this.pos.copy()));
        }
        return new TokenResult_1.default(new Token_1.default(constants_1.TokenType.EQ, undefined, posStart, this.pos.copy()));
    }
    makeLessThan() {
        let posStart = this.pos.copy();
        this.advance();
        if (this.currentChar == '=') {
            this.advance();
            return new TokenResult_1.default(new Token_1.default(constants_1.TokenType.LTE, undefined, posStart, this.pos.copy()));
        }
        return new TokenResult_1.default(new Token_1.default(constants_1.TokenType.LT, undefined, posStart, this.pos.copy()));
    }
    makeGreaterThan() {
        let posStart = this.pos.copy();
        this.advance();
        if (this.currentChar == '=') {
            this.advance();
            return new TokenResult_1.default(new Token_1.default(constants_1.TokenType.GTE, undefined, posStart, this.pos.copy()));
        }
        return new TokenResult_1.default(new Token_1.default(constants_1.TokenType.GT, undefined, posStart, this.pos.copy()));
    }
    makeAnd() {
        let posStart = this.pos.copy();
        this.advance();
        if (this.currentChar == '&') {
            this.advance();
            return new TokenResult_1.default(new Token_1.default(constants_1.TokenType.LAND, undefined, posStart, this.pos.copy()));
        }
        return new TokenResult_1.default(new Token_1.default(constants_1.TokenType.AND, undefined, posStart, this.pos.copy()));
    }
    makeOr() {
        let posStart = this.pos.copy();
        this.advance();
        if (this.currentChar == '|') {
            this.advance();
            return new TokenResult_1.default(new Token_1.default(constants_1.TokenType.LOR, undefined, posStart, this.pos.copy()));
        }
        return new TokenResult_1.default(new Token_1.default(constants_1.TokenType.OR, undefined, posStart, this.pos.copy()));
    }
    saveTokens(tokens, fileName) {
        require('fs').writeFileSync(fileName, JSON.stringify(tokens, null, 2));
    }
}
exports.default = Lexer;
//# sourceMappingURL=Lexer.js.map