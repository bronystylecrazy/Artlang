/** PRIMITIVE CONSTANTS */
const DIGIT: string = '1234567890';
const LETTERS: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LETTER_DIGIT: string = LETTERS + DIGIT;

/** TOKEN TYPES */
enum TokenType{
    INT = "INT",
    FLOAT = "FLOAT",
    PLUS = "PLUS",
    MINUS = "MINUS",
    MUL = "MUL",
    DIV = "DIV",
    POW = "POW",
    STRING = "STRING",
    LPAREN = "LPAREN",
    RPAREN = "RPAREN",
    NEWLINE = "NEWLINE",
    IDENTIFIER = "IDENTIFIER",
    EQ = `EQ`,
    KEYWORD = 'KEYWORD',
    EOF = "EOF",
    END = "END",
    EEQ = `EEQ`,
    NEQ = `NEQ`,
    LT = `LT`,
    GT = `GT`,
    LTE = `LTE`,
    GTE = `GTE`,
    NOT = "NOT",
    AND = "AND",
    OR = "OR",
    LAND = "LAND",
    LOR = "LOR",
    XOR = "XOR",
    INV = "INV",
    COMMA = `COMMA`,
    COLON = `COLON`,
    SEMICOLON = `SEMICOLON`,
};

/** KEYWORDS */
const KEYWORDS: string[] = [
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

export {
    DIGIT,
    KEYWORDS,
    LETTER_DIGIT,
    LETTERS,
    TokenType
};