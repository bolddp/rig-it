"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
const chalk_1 = __importDefault(require("chalk"));
class ConsoleLogger {
    getIndent(indent) {
        return ' '.repeat(indent * 2);
    }
    log(indent, msg) {
        console.log(`${this.getIndent(indent)}${msg}`);
    }
    printWhite(indent, msg) {
        this.log(indent, chalk_1.default.white(msg));
    }
    printBlue(indent, msg) {
        this.log(indent, chalk_1.default.blue(msg));
    }
    printGreen(indent, msg) {
        this.log(indent, chalk_1.default.green(msg));
    }
    printRed(indent, msg) {
        this.log(indent, chalk_1.default.red(msg));
    }
    printGray(indent, msg) {
        this.log(indent, chalk_1.default.gray(msg));
    }
}
exports.ConsoleLogger = ConsoleLogger;
