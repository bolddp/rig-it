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
        this.log = {
            rig: {
                info: (msg) => this.reporters.forEach((r) => { var _a, _b, _c; return (_c = (_b = (_a = r.log) === null || _a === void 0 ? void 0 : _a.rig) === null || _b === void 0 ? void 0 : _b.info) === null || _c === void 0 ? void 0 : _c.call(_b, msg); }),
                success: (msg) => this.reporters.forEach((r) => { var _a, _b, _c; return (_c = (_b = (_a = r.log) === null || _a === void 0 ? void 0 : _a.rig) === null || _b === void 0 ? void 0 : _b.success) === null || _c === void 0 ? void 0 : _c.call(_b, msg); }),
                error: (msg) => this.reporters.forEach((r) => { var _a, _b, _c; return (_c = (_b = (_a = r.log) === null || _a === void 0 ? void 0 : _a.rig) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.call(_b, msg); }),
            },
            test: {
                info: (msg) => this.reporters.forEach((r) => { var _a, _b, _c; return (_c = (_b = (_a = r.log) === null || _a === void 0 ? void 0 : _a.test) === null || _b === void 0 ? void 0 : _b.info) === null || _c === void 0 ? void 0 : _c.call(_b, msg); }),
                success: (msg) => this.reporters.forEach((r) => { var _a, _b, _c; return (_c = (_b = (_a = r.log) === null || _a === void 0 ? void 0 : _a.test) === null || _b === void 0 ? void 0 : _b.success) === null || _c === void 0 ? void 0 : _c.call(_b, msg); }),
                error: (msg) => this.reporters.forEach((r) => { var _a, _b, _c; return (_c = (_b = (_a = r.log) === null || _a === void 0 ? void 0 : _a.test) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.call(_b, msg); }),
            },
            testStep: {
                info: (msg) => this.reporters.forEach((r) => { var _a, _b, _c; return (_c = (_b = (_a = r.log) === null || _a === void 0 ? void 0 : _a.testStep) === null || _b === void 0 ? void 0 : _b.info) === null || _c === void 0 ? void 0 : _c.call(_b, msg); }),
                success: (msg) => this.reporters.forEach((r) => { var _a, _b, _c; return (_c = (_b = (_a = r.log) === null || _a === void 0 ? void 0 : _a.testStep) === null || _b === void 0 ? void 0 : _b.success) === null || _c === void 0 ? void 0 : _c.call(_b, msg); }),
                error: (msg) => this.reporters.forEach((r) => { var _a, _b, _c; return (_c = (_b = (_a = r.log) === null || _a === void 0 ? void 0 : _a.testStep) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.call(_b, msg); }),
            },
        };
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
    reportTestResponse(testId, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            for (const logger of this.reporters) {
                yield ((_a = logger.reportTestResponse) === null || _a === void 0 ? void 0 : _a.call(logger, testId, response));
            }
        });
    }
    finish(result) {
        return __awaiter(this, void 0, void 0, function* () {
            this.reporters.forEach((logger) => {
                var _a;
                (_a = logger.finish) === null || _a === void 0 ? void 0 : _a.call(logger, result);
            });
        });
    }
}
exports.CompositeReporter = CompositeReporter;
