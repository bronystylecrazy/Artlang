import Error from "../error/ErrorBase";
import Node from "../node/NodeBase";

class ParseResult{

    advance_count: number = 0;

    constructor(public error?: Error, public node?: Node){}

    isError(){
        return this.error != null || this.error != undefined;
    }

    register_advancement(){
        this.advance_count++;
    }

    register(result: ParseResult){
        this.advance_count += result.advance_count;
        if(result.error){
            this.error = result.error;
        }
        return result.node;
    }

    success(node: Node){
        this.node = node;
        return this;
    }

    failure(error: Error){
        if(!this.error || this.advance_count == 0)
            this.error = error;
        return this;
    }
    
    toString(){
        if(this.node){
            return this.node.toString();
        }
        return this.node;
    }
}

export default ParseResult;