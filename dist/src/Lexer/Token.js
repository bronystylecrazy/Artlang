"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
class Token {
    constructor(type, value, posStart, posEnd) {
        this.type = type;
        this.value = value;
        this.posStart = posStart;
        this.posEnd = posEnd;
        this.type = type || constants_1.TokenType.EOF;
        this.value = value || null;
        this.posStart = posStart || null;
        this.posEnd = posEnd || null;
        if (typeof posStart !== 'undefined') {
            this.posStart = posStart.copy();
            this.posEnd = posStart.copy();
            this.posEnd.advance();
        }
        if (typeof posEnd !== 'undefined') {
            this.posEnd = posEnd;
        }
    }
    matches(type, value) {
        return this.type === type &&
            (typeof value === 'undefined' || this.value === value);
    }
    setPos(posStart, posEnd) {
        this.posStart = posStart;
        this.posEnd = posEnd;
        return this;
    }
    toString() {
        if (typeof this.value === 'undefined')
            return this.type;
        return `${this.type}:${this.value}`;
    }
}
exports.default = Token;
//# sourceMappingURL=Token.js.map