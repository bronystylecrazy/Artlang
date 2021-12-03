import Error from "../Error/ErrorBase";
import Token from "../Lexer/Token";

class TokenResult {
    token: Token;
    error: Error;

    constructor(value: Token | Error) {
        if(value instanceof Error){
            this.error = value;
        }
        else if(value instanceof Token){
            this.token = value;
        }
    }

    isError(){
        return (typeof this.error !== 'undefined');
    }

    getToken(){
        return this.token;
    }
}

export default TokenResult;