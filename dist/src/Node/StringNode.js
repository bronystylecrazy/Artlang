"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NodeBase_1 = __importDefault(require("./NodeBase"));
class StringNode extends NodeBase_1.default {
    constructor(token, value) {
        super();
        this.token = token;
        this.value = value;
        this.posStart = this.token.posStart;
        this.posEnd = this.token.posEnd;
    }
    toString() {
        return `"${this.token.toString()}"`;
    }
}
exports.default = StringNode;
//# sourceMappingURL=StringNode.js.map