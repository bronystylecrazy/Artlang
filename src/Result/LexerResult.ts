import Error from "../error/ErrorBase";
import Token from "../lexer/Token";

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