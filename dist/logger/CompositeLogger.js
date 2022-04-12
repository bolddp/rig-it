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
exports.CompositeLogger = void 0;
class CompositeLogger {
    constructor(loggers) {
        this.loggers = loggers !== null && loggers !== void 0 ? loggers : [];
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            this.loggers.forEach((logger) => {
                var _a;
                (_a = logger.setup) === null || _a === void 0 ? void 0 : _a.call(logger);
            });
        });
    }
    printWhite(indent, msg) {
        this.loggers.forEach((logger) => {
            logger.printWhite(indent, msg);
        });
    }
    printBlue(indent, msg) {
        this.loggers.forEach((logger) => {
            logger.printBlue(indent, msg);
        });
    }
    printGreen(indent, msg) {
        this.loggers.forEach((logger) => {
            logger.printGreen(indent, msg);
        });
    }
    printRed(indent, msg) {
        this.loggers.forEach((logger) => {
            logger.printRed(indent, msg);
        });
    }
    printGray(indent, msg) {
        this.loggers.forEach((logger) => {
            logger.printGray(indent, msg);
        });
    }
    reportTestResponse(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            for (const logger of this.loggers) {
                yield ((_a = logger.reportTestResponse) === null || _a === void 0 ? void 0 : _a.call(logger, params));
            }
        });
    }
    finish() {
        return __awaiter(this, void 0, void 0, function* () {
            this.loggers.forEach((logger) => {
                var _a;
                (_a = logger.finish) === null || _a === void 0 ? void 0 : _a.call(logger);
            });
        });
    }
}
exports.CompositeLogger = CompositeLogger;
