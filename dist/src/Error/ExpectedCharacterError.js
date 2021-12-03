"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorBase_1 = __importDefault(require("./ErrorBase"));
class ExpectedCharacterError extends ErrorBase_1.default {
    constructor(message, posStart, posEnd, context) {
        super("ExpectedCharacterError", message, posStart, posEnd, context);
        this.message = message;
        this.posStart = posStart;
        this.posEnd = posEnd;
        this.context = context;
    }
}
exports.default = ExpectedCharacterError;
//# sourceMappingURL=ExpectedCharacterError.js.map