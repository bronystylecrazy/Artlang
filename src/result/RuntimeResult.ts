import Node from "../node/NodeBase";

class RuntimeResult{
    constructor(public error?: Error, public value?: Node){}
    
    register(result){

        if(result.error){
            this.error = result.error;
        }

        if(result instanceof RuntimeResult){
            return result.value;
        }

        return result;
    }

    isError(){
        return this.error !== undefined || this.error !== null;
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

export default RuntimeResult;