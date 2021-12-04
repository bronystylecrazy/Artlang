class SymbolTable {
    
    public symbols = {};
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

    of(symbols: Object){
        const table = new SymbolTable();
        for (const name in symbols) {
            table.set(name, symbols[name]);
        }
        return table;
    }
}

export default SymbolTable;