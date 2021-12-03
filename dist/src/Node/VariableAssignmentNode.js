"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NodeBase_1 = __importDefault(require("./NodeBase"));
class VariableAssignmentNode extends NodeBase_1.default {
    constructor(token, valueNode) {
        super();
        this.token = token;
        this.valueNode = valueNode;
        this.posStart = this.token.posStart;
        this.posEnd = this.valueNode.posEnd;
    }
}
exports.default = VariableAssignmentNode;
//# sourceMappingURL=VariableAssignmentNode.js.map