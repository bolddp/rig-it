"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestConnectorLogger = exports.TestLogger = exports.TestRigLogger = void 0;
const chalk_1 = __importDefault(require("chalk"));
class ConsoleLogger {
    constructor(indent) {
        this.indent = ' '.repeat(indent * 2);
    }
    log(msg) {
        console.log(`${this.indent}${msg}`);
    }
    info(msg) {
        this.log(chalk_1.default.blue(msg));
    }
    success(msg) {
        this.log(chalk_1.default.green(msg));
    }
    failure(msg) {
        this.log(chalk_1.default.red(msg));
    }
}
class TestRigLogger extends ConsoleLogger {
    constructor() {
        super(0);
    }
}
exports.TestRigLogger = TestRigLogger;
class TestLogger extends ConsoleLogger {
    constructor() {
        super(1);
    }
}
exports.TestLogger = TestLogger;
class TestConnectorLogger extends ConsoleLogger {
    constructor() {
        super(2);
    }
    request(msg) {
        super.log(chalk_1.default.gray(msg));
    }
}
exports.TestConnectorLogger = TestConnectorLogger;
