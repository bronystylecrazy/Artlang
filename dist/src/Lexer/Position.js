"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Position {
    constructor(idx, line, column, fileName, fileText) {
        this.idx = idx;
        this.line = line;
        this.column = column;
        this.fileName = fileName;
        this.fileText = fileText;
        this.idx = idx || 0;
        this.line = line || 0;
        this.column = column || 0;
        this.fileName = fileName || "";
        this.fileText = fileText || "";
    }
    advance(currentChar) {
        this.idx++;
        this.column++;
        if (currentChar === "\n") {
            this.advanceLine();
        }
        return this;
    }
    advanceLine() {
        this.line++;
        this.column = 0;
        return this;
    }
    copy() {
        return new Position(this.idx, this.line, this.column, this.fileName, this.fileText);
    }
    toString() {
        return `${this.fileName}:${this.line}:${this.column}`;
    }
}
exports.default = Position;
//# sourceMappingURL=Position.js.map