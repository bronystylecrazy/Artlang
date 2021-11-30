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
    }
    
    register(result){
        if(result instanceof ParseResult){
            if(result.error){
                this.error = result.error;
            }
            return result.node;
        }
        return result;
    }

    success(node){
        this.node = node;
        return this;
    }

    failure(error){
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