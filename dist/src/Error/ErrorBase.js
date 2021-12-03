"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stringWithArrows_1 = __importDefault(require("../utils/stringWithArrows"));
class Error {
    constructor(name, message, posStart, posEnd, context) {
        this.name = name;
        this.message = message;
        this.posStart = posStart;
        this.posEnd = posEnd;
        this.context = context;
        this.name = name || "UnknownError";
        this.message = message || "Something went wrong";
        this.posStart = posStart;
        this.posEnd = posEnd;
        this.context = context;
    }
    toString() {
        var _a, _b, _c, _d;
        let result = `${this.name}: ${this.message}`;
        result += "\n";
        result += `${(0, stringWithArrows_1.default)((_a = this.posStart) === null || _a === void 0 ? void 0 : _a.fileText, this.posStart, this.posEnd)}`;
        result += `\n    at ${(_b = this.posStart) === null || _b === void 0 ? void 0 : _b.fileName}, Line: ${((_c = this.posStart) === null || _c === void 0 ? void 0 : _c.line) + 1}, Column: ${((_d = this.posStart) === null || _d === void 0 ? void 0 : _d.column) + 1}`;
        return result;
    }
}
exports.default = Error;
//# sourceMappingURL=ErrorBase.js.map