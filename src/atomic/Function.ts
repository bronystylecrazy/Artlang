import Context from "../context/Context";
import Interpreter from "../interpreter/Interpreter";
import RuntimeResult from "../result/RuntimeResult";
import Position from "../lexer/Position";
import Atomic from "./Atomic";
import SymbolTable from "../context/SymbolTable";
import RuntimeError from "../error/RuntimeError";
import Node from "../node/NodeBase";

class Function extends Atomic {
    constructor(public value: string = "<anonymous>",public bodyNode: Node,public argumentNames: string[],posStart?: Position, posEnd?: Position,context?: Context) {
        super(value, posStart, posEnd,context);
    }

    execute(args: any[]){
        let res = new RuntimeResult();
        let interpreter = new Interpreter();
        let functionContext = Context.createContext(this.value, this.context,this.posStart, new SymbolTable(this.context.symbols));
        console.log('FUNC CONTEXT',functionContext);
        if(args.length != this.argumentNames.length){
            res.failure(new RuntimeError(`Function '${this.value}' called with ${args.length} arguments, but expected ${this.argumentNames.length}`, this.posStart, this.posEnd, this.context));
            return res;
        }

        for(let i = 0; i < args.length; i++){
            let argumentName = this.argumentNames[i];
            let argumentValue = args[i];
            argumentValue.setContext(functionContext);
            functionContext.symbols.set(argumentName, argumentValue);
        }

        let value = res.register(interpreter.visit(this.bodyNode, functionContext));
        if(value instanceof RuntimeResult){
            return value;
        }
        if(res.error) return res;
        return res.success(value);
    }

    copy(): Function {
        return new Function(this.value,this.bodyNode,this.argumentNames,this.posStart,this.posEnd,this.context);
    }

    toString(){
        return `<function ${this.value}>`;
    }
}

export default Function;