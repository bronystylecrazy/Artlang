"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = exports.LETTERS = exports.LETTER_DIGIT = exports.KEYWORDS = exports.DIGIT = void 0;
/** PRIMITIVE CONSTANTS */
const DIGIT = '1234567890';
exports.DIGIT = DIGIT;
const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
exports.LETTERS = LETTERS;
const LETTER_DIGIT = LETTERS + DIGIT;
exports.LETTER_DIGIT = LETTER_DIGIT;
/** TOKEN TYPES */
var TokenType;
(function (TokenType) {
    TokenType["INT"] = "INT";
    TokenType["FLOAT"] = "FLOAT";
    TokenType["PLUS"] = "PLUS";
    TokenType["MINUS"] = "MINUS";
    TokenType["MUL"] = "MUL";
    TokenType["DIV"] = "DIV";
    TokenType["POW"] = "POW";
    TokenType["STRING"] = "STRING";
    TokenType["LPAREN"] = "LPAREN";
    TokenType["RPAREN"] = "RPAREN";
    TokenType["NEWLINE"] = "NEWLINE";
    TokenType["IDENTIFIER"] = "IDENTIFIER";
    TokenType["EQ"] = "EQ";
    TokenType["KEYWORD"] = "KEYWORD";
    TokenType["EOF"] = "EOF";
    TokenType["END"] = "END";
    TokenType["EEQ"] = "EEQ";
    TokenType["NEQ"] = "NEQ";
    TokenType["LT"] = "LT";
    TokenType["GT"] = "GT";
    TokenType["LTE"] = "LTE";
    TokenType["GTE"] = "GTE";
    TokenType["NOT"] = "NOT";
    TokenType["AND"] = "AND";
    TokenType["OR"] = "OR";
    TokenType["LAND"] = "LAND";
    TokenType["LOR"] = "LOR";
    TokenType["XOR"] = "XOR";
    TokenType["INV"] = "INV";
    TokenType["COMMA"] = "COMMA";
    TokenType["COLON"] = "COLON";
    TokenType["SEMICOLON"] = "SEMICOLON";
})(TokenType || (TokenType = {}));
exports.TokenType = TokenType;
;
/** KEYWORDS */
const KEYWORDS = [
    'and',
    'clear',
    'else',
    'false',
    'if',
    'elif',
    'let',
    'not',
    'or',
    'true',
    'undefined',
    'for',
    'in',
    'of',
    'while',
    'break',
    'to',
    'step',
];
exports.KEYWORDS = KEYWORDS;
//# sourceMappingURL=constants.js.map