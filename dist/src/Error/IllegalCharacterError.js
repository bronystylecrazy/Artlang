"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorBase_1 = __importDefault(require("./ErrorBase"));
class IllegalCharacterError extends ErrorBase_1.default {
    constructor(message, posStart, posEnd, context) {
        super("IllegalCharacterError", message, posStart, posEnd, context);
        this.message = message;
        this.posStart = posStart;
        this.posEnd = posEnd;
        this.context = context;
    }
}
exports.default = IllegalCharacterError;
//# sourceMappingURL=IllegalCharacterError.js.map