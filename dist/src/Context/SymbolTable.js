"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SymbolTable {
    constructor(parent = null) {
        this.parent = parent;
        this.symbols = {};
    }
    get(name) {
        if (name in this.symbols) {
            return this.symbols[name];
        }
        if (this.parent) {
            return this.parent.get(name);
        }
        return null;
    }
    set(name, value) {
        this.symbols[name] = value;
    }
    remove(name) {
        delete this.symbols[name];
    }
    create(parent) {
        return new SymbolTable(parent);
    }
}
exports.default = SymbolTable;
//# sourceMappingURL=SymbolTable.js.map