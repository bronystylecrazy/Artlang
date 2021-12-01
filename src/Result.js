class RuntimeResult{
    constructor(error, value){
        this.error = error;
        this.value = value;
    }
    
    register(result){
        if(result.error){
            this.error = result.error;
        }
        if(result instanceof RuntimeResult){
            return result.value;
        }
        return result;
    }

    success(value){
        this.value = value;
        return this;
    }

    failure(error){
        this.error = error;
        return this;
    }
    
    toString(){
        return this.value;
    }
}


class ParseResult{
    constructor(error, node){
        this.error = error;
        this.node = node;
        this.advance_count = 0;
    }
    register_advancement(){
        this.advance_count++;
    }
    register(result){
        this.advance_count += result.advance_count;
        if(result.error){
            this.error = result.error;
        }
        return result.node;
    }

    success(node){
        this.node = node;
        return this;
    }

    failure(error){
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

module.exports = {
    RuntimeResult,
    ParseResult,
}