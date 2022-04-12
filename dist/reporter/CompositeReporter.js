"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeReporter = void 0;
class CompositeReporter {
    constructor(reporters) {
        this.reporters = reporters !== null && reporters !== void 0 ? reporters : [];
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            this.reporters.forEach((logger) => {
                var _a;
                (_a = logger.setup) === null || _a === void 0 ? void 0 : _a.call(logger);
            });
        });
    }
    printWhite(indent, msg) {
        this.reporters.forEach((logger) => {
            logger.printWhite(indent, msg);
        });
    }
    printBlue(indent, msg) {
        this.reporters.forEach((logger) => {
            logger.printBlue(indent, msg);
        });
    }
    printGreen(indent, msg) {
        this.reporters.forEach((logger) => {
            logger.printGreen(indent, msg);
        });
    }
    printRed(indent, msg) {
        this.reporters.forEach((logger) => {
            logger.printRed(indent, msg);
        });
    }
    printGray(indent, msg) {
        this.reporters.forEach((logger) => {
            logger.printGray(indent, msg);
        });
    }
    reportTestResponse(testId, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            for (const logger of this.reporters) {
                yield ((_a = logger.reportTestResponse) === null || _a === void 0 ? void 0 : _a.call(logger, testId, response));
            }
        });
    }
    finish(isSuccess) {
        return __awaiter(this, void 0, void 0, function* () {
            this.reporters.forEach((logger) => {
                var _a;
                (_a = logger.finish) === null || _a === void 0 ? void 0 : _a.call(logger, isSuccess);
            });
        });
    }
}
exports.CompositeReporter = CompositeReporter;
