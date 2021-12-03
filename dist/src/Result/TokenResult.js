"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorBase_1 = __importDefault(require("../Error/ErrorBase"));
const Token_1 = __importDefault(require("../Lexer/Token"));
class TokenResult {
    constructor(value) {
        if (value instanceof ErrorBase_1.default) {
            this.error = value;
        }
        else if (value instanceof Token_1.default) {
            this.token = value;
        }
    }
    isError() {
        return (typeof this.error !== 'undefined');
    }
    getToken() {
        return this.token;
    }
}
exports.default = TokenResult;
//# sourceMappingURL=TokenResult.js.map