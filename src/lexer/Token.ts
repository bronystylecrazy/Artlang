import { TokenType } from "../constants";
import Position from "./Position";

class Token{
    constructor(public type?: TokenType, public value?: any, public posStart?: Position, public posEnd?: Position){
        this.type = type || TokenType.EOF;
        this.value = value;
        this.posStart = posStart || null;
        this.posEnd = posEnd || null;

        if(typeof posStart !== 'undefined'){
            this.posStart = posStart.copy();
            this.posEnd = posStart.copy();
            this.posEnd.advance();
        }

        if(typeof posEnd  !== 'undefined'){
            this.posEnd = posEnd;
        }
    }

    matches(type: TokenType, value?: any){
        return this.type === type &&
            (typeof value === 'undefined' || this.value === value);
    }

    is(...types: TokenType[]): boolean{
        if(types.length <= 0)
            return this.type === types[0];
        return types.includes(this.type);
    }

    isNot(...types: TokenType[]): boolean{
        return !this.is(...types);
    }

    setPos(posStart: Position, posEnd: Position){
        this.posStart = posStart;
        this.posEnd = posEnd;
        return this;
    }

    toString(){
        if(typeof this.value === 'undefined')
            return this.type;
        return `${this.type}:${this.value}`;
    }
}

export default Token;