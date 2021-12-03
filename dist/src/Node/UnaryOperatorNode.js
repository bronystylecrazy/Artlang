"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NodeBase_1 = __importDefault(require("./NodeBase"));
class UnaryOperatorNode extends NodeBase_1.default {
    constructor(operator, right) {
        super();
        this.operator = operator;
        this.right = right;
        this.posStart = this.operator.posStart;
        this.posEnd = this.right.posEnd;
    }
    toString() {
        return `(${this.operator.toString()},${this.right.toString()})`;
    }
}
exports.default = UnaryOperatorNode;
//# sourceMappingURL=UnaryOperatorNode.js.map