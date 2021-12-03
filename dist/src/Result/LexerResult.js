"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorBase_1 = __importDefault(require("../Error/ErrorBase"));
class LexerResult {
    constructor(value) {
        this.tokens = [];
        if (value instanceof ErrorBase_1.default) {
            this.error = value;
        }
        else if (value instanceof Array) {
            this.tokens = value;
        }
    }
    isError() {
        return (typeof this.error !== 'undefined');
    }
    getTokens() {
        return this.tokens;
    }
}
exports.default = LexerResult;
//# sourceMappingURL=LexerResult.js.map