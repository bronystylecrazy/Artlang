import fs from 'fs';
import Position from "../lexer/Position";
import SymbolTable from "../context/SymbolTable";

class Context{
    constructor(
        public displayName: string = "",
        public parent: Context = null,
        public parentEntryPosition: Position = null,
        public symbols?: SymbolTable
    ){
        this.displayName = displayName;
        this.parent = parent;
        this.parentEntryPosition = parentEntryPosition;
        if(!symbols) this.symbols = new SymbolTable();
    }
    static createContext(
        displayName: string = "",
        parent: Context = null,
        parentEntryPosition: Position = null,
        symbols?: SymbolTable
    ){
        return new Context(displayName, parent, parentEntryPosition,symbols)
    }

    loadSymbols(fileName="memory.json"){
        const raw = fs.readFileSync(fileName, 'utf8');
        const data = JSON.parse(raw.trim() === '' ? '{}' : raw.trim());
        this.symbols = data;
        
        return this;
    }

    saveSymbols(fileName="memory.json"){
        // get rid of circular references
        const symbols = this.serializeSymbols();
        const data = JSON.stringify(symbols, null, 2);
        fs.writeFileSync(fileName, data);
        return this;
    }

    serializeSymbols(){
        const _symbols = {...this.symbols};
        for(var symbol in _symbols){
            delete _symbols[symbol].context;
        }
        return _symbols;
    }
}

export default Context;