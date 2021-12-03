import Position from "../Lexer/Position";

class Node{
    public name: string;
    public posStart: Position;
    public posEnd: Position;

    constructor(){
        this.name = this.constructor.name;
    }
}

export default Node;