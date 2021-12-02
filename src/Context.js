const fs = require('fs');

class Context{
    constructor(displayName, parent, parentEntryPosition){
        this.displayName = displayName;
        this.parent = parent;
        this.parentEntryPosition = parentEntryPosition;
        this.symbols = {};
    }
    static createContext = (displayName, parent, parentEntryPosition) => {
        return new Context(displayName, parent, parentEntryPosition)
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

module.exports = {
    Context
}