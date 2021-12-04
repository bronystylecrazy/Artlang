class SymbolTable {
    
    symbols = {};
    constructor(public parent: SymbolTable = null) {}
    
    get(name: string){

        if (name in this.symbols) {
            return this.symbols[name];
        }

        if (this.parent) {
            return this.parent.get(name);
        }

        return null;
    }

    set(name: string, value){
        this.symbols[name] = value;
    }

    remove(name: string){
        delete this.symbols[name];
    }

    create(parent?: SymbolTable){
        return new SymbolTable(parent);
    }
}

export default SymbolTable;