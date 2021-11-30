const DIGIT = '1234567890';
const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LETTER_DIGIT = LETTERS + DIGIT;
const TT_INT = "INT";
const TT_FLOAT = "FLOAT";
const TT_PLUS = "PLUS";
const TT_MINUS = "MINUS";
const TT_MUL = "MUL";
const TT_DIV = "DIV";
const TT_POW = "POW";
const TT_LPAREN = "LPAREN";
const TT_RPAREN = "RPAREN";
const TT_NEWLINE = "NEWLINE";
const TT_IDENTIFIER = "IDENTIFIER";
const TT_EQ = `EQ`;
const TT_KEYWORD = 'KEYWORD';
const TT_EOF = "EOF";
const noop = () => {};

const KEYWORDS = [
    'let'
];

module.exports = {
    TT_INT,
    TT_FLOAT,
    TT_PLUS,
    TT_MINUS,
    TT_MUL,
    TT_DIV,
    TT_POW,
    TT_LPAREN,
    TT_RPAREN,
    TT_NEWLINE,
    TT_EOF,
    noop,
    DIGIT,
    LETTERS,
    LETTER_DIGIT,
    TT_IDENTIFIER,
    TT_EQ,
    TT_KEYWORD,
    KEYWORDS
};