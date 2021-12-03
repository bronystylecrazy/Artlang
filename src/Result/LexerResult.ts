import Error from "../Error/ErrorBase";
import Token from "../Lexer/Token";

class LexerResult {
    tokens: Token[] = [];
    error: Error;

    constructor(value: Token[] | Error) {
        if(value instanceof Error){
            this.error = value;
        }
        else if(value instanceof Array){
            this.tokens = value;
        }
    }

    isError(){
        return (typeof this.error !== 'undefined');
    }

    getTokens(){
        return this.tokens;
    }
}

export default LexerResult;