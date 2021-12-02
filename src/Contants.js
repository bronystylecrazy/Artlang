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
const TT_STRING = "STRING";
const TT_LPAREN = "LPAREN";
const TT_RPAREN = "RPAREN";
const TT_NEWLINE = "NEWLINE";
const TT_IDENTIFIER = "IDENTIFIER";
const TT_EQ = `EQ`;
const TT_KEYWORD = 'KEYWORD';
const TT_EOF = "EOF";
const TT_END = "END";
const TT_EEQ = `EEQ`;
const TT_NEQ = `NEQ`;
const TT_LT = `LT`;
const TT_GT = `GT`;
const TT_LTE = `LTE`;
const TT_GTE = `GTE`;
const TT_NOT = "NOT";
const TT_AND = "AND";
const TT_OR = "OR";
const TT_LAND = "LAND";
const TT_LOR = "LOR";
const TT_XOR = "XOR";
const TT_INV = "INV";
const TT_COMMA = `COMMA`;
const noop = () => {};

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

module.exports = {
    DIGIT,
    KEYWORDS,
    LETTER_DIGIT,
    LETTERS,
    noop,
    TT_AND,
    TT_COMMA,
    TT_DIV,
    TT_EEQ,
    TT_END,
    TT_EOF,
    TT_EQ,
    TT_FLOAT,
    TT_GT,
    TT_GTE,
    TT_IDENTIFIER,
    TT_INT,
    TT_INV,
    TT_KEYWORD,
    TT_LAND,
    TT_LOR,
    TT_LPAREN,
    TT_LT,
    TT_LTE,
    TT_MINUS,
    TT_MUL,
    TT_NEQ,
    TT_NEWLINE,
    TT_NOT,
    TT_OR,
    TT_PLUS,
    TT_POW,
    TT_RPAREN,
    TT_STRING,
    TT_XOR,
};