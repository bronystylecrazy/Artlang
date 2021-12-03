"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const repeatString_1 = __importDefault(require("./repeatString"));
const stringWithArrows = (text, posStart, posEnd) => {
    let result = '';
    let idx_start = Math.max(0, text.slice(posStart.idx).lastIndexOf('\n'));
    let idx_end = text.indexOf('\n', idx_start + 1);
    if (idx_end < 0)
        idx_end = text.length;
    let lineCount = posEnd.line - posStart.line + 1;
    for (let i = 0; i < lineCount; i++) {
        let line = text.slice(idx_start, idx_end);
        let columnStart = i == 0 ? posStart.column : 0;
        let columnEnd = i == lineCount - 1 ? posEnd.column : line.length - 1;
        result += line + '\n';
        result += (0, repeatString_1.default)(columnStart, ' ') + (0, repeatString_1.default)(Math.abs(columnEnd - columnStart), '^');
        idx_start = idx_end;
        idx_end = text.indexOf('\n', idx_start + 1);
        if (idx_end < 0)
            idx_end = text.length;
    }
    return result.replace(/\t$/, '');
};
exports.default = stringWithArrows;
//# sourceMappingURL=stringWithArrows.js.map