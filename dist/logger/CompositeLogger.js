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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            for (const logger of this.loggers) {
                (_a = logger.setup) === null || _a === void 0 ? void 0 : _a.call(logger);
            }
        });
    }
    white(indent, msg) {
        for (const logger of this.loggers) {
            logger.white(indent, msg);
        }
    }
    blue(indent, msg) {
        for (const logger of this.loggers) {
            logger.blue(indent, msg);
        }
    }
    green(indent, msg) {
        for (const logger of this.loggers) {
            logger.green(indent, msg);
        }
    }
    red(indent, msg) {
        for (const logger of this.loggers) {
            logger.red(indent, msg);
        }
    }
    gray(indent, msg) {
        for (const logger of this.loggers) {
            logger.gray(indent, msg);
        }
    }
    finish() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            for (const logger of this.loggers) {
                (_a = logger.finish) === null || _a === void 0 ? void 0 : _a.call(logger);
            }
        });
    }
}
exports.CompositeLogger = CompositeLogger;
