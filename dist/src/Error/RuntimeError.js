"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stringWithArrows_1 = __importDefault(require("../utils/stringWithArrows"));
const ErrorBase_1 = __importDefault(require("./ErrorBase"));
class RuntimeError extends ErrorBase_1.default {
    constructor(message, posStart, posEnd, context) {
        super("RuntimeError", message, posStart, posEnd, context);
        this.message = message;
        this.posStart = posStart;
        this.posEnd = posEnd;
        this.context = context;
    }
    generateStacktrace(body) {
        let result = ``;
        let ctx = this.context;
        let position = this.posStart;
        while (ctx) {
            result = `    at ${position.fileName}, Line: ${position.line + 1}, Column: ${position.column + 1} in ${ctx.displayName}\n` + result;
            ctx = ctx === null || ctx === void 0 ? void 0 : ctx.parent;
            position = ctx === null || ctx === void 0 ? void 0 : ctx.parentEntryPosition;
        }
        return `Traceback from these stackframes:\n\n${body}\n${this.name}: ${this.message}\n` + result;
    }
    toString() {
        var _a;
        let result = ``;
        result += this.generateStacktrace((0, stringWithArrows_1.default)((_a = this.posStart) === null || _a === void 0 ? void 0 : _a.fileText, this.posStart, this.posEnd));
        return result;
    }
}
exports.default = RuntimeError;
//# sourceMappingURL=RuntimeError.js.map