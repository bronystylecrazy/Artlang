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
}

module.exports = {
    Context
}