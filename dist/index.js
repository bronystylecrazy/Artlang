"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Lexer_1 = __importDefault(require("./src/Lexer/Lexer"));
const lexer = new Lexer_1.default('1+3 ', 'sirawit.txt');
const result = lexer.build({ save: true });
if (result.isError()) {
    console.error(result.error.toString());
    process.exit();
}
//# sourceMappingURL=index.js.map