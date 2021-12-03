"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NodeBase_1 = __importDefault(require("./NodeBase"));
class UndefinedNode extends NodeBase_1.default {
    constructor(token) {
        super();
        this.token = token;
        this.value = "undefined";
        this.posStart = this.token.posStart;
        this.posEnd = this.token.posEnd;
    }
    toString() {
        return `undefined`;
    }
}
exports.default = UndefinedNode;
//# sourceMappingURL=UndefinedNode.js.map