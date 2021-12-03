"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const SymbolTable_1 = __importDefault(require("./SymbolTable"));
class Context {
    constructor(displayName = "", parent = null, parentEntryPosition = null, symbols) {
        this.displayName = displayName;
        this.parent = parent;
        this.parentEntryPosition = parentEntryPosition;
        this.symbols = symbols;
        this.displayName = displayName;
        this.parent = parent;
        this.parentEntryPosition = parentEntryPosition;
        if (symbols)
            this.symbols = new SymbolTable_1.default();
    }
    static createContext(displayName = "", parent = null, parentEntryPosition = null) {
        return new Context(displayName, parent, parentEntryPosition);
    }
    loadSymbols(fileName = "memory.json") {
        const raw = fs_1.default.readFileSync(fileName, 'utf8');
        const data = JSON.parse(raw.trim() === '' ? '{}' : raw.trim());
        this.symbols = data;
        return this;
    }
    saveSymbols(fileName = "memory.json") {
        // get rid of circular references
        const symbols = this.serializeSymbols();
        const data = JSON.stringify(symbols, null, 2);
        fs_1.default.writeFileSync(fileName, data);
        return this;
    }
    serializeSymbols() {
        const _symbols = Object.assign({}, this.symbols);
        for (var symbol in _symbols) {
            delete _symbols[symbol].context;
        }
        return _symbols;
    }
}
exports.default = Context;
//# sourceMappingURL=Context.js.map