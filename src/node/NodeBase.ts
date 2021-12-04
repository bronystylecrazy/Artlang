import Position from "../lexer/Position";

class Node{
    public name: string;
    public posStart: Position;
    public posEnd: Position;

    constructor(){
        this.name = this.constructor.name;
    }

    setPos(posStart, posEnd){
        this.posStart = posStart;
        this.posEnd = posEnd;
        return this;
    }
}

export default Node;