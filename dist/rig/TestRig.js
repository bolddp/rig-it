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
exports.TestRig = void 0;
const TestConnector_1 = require("../connector/TestConnector");
const ConsoleLogger_1 = require("../logger/ConsoleLogger");
const TestLogger_1 = require("../logger/TestLogger");
const Test_1 = require("../test/Test");
/**
 * The test rig keeps track of the execution of an integration test: running tests, keeping
 * track of any teardown necessary and producing test results.
 */
class TestRig {
    constructor(config) {
        var _a;
        this.rigFailureTeardownEntries = [];
        this.rigSuccessTeardownEntries = [];
        this.config = Object.assign(Object.assign({}, config), { logger: (_a = config === null || config === void 0 ? void 0 : config.logger) !== null && _a !== void 0 ? _a : new ConsoleLogger_1.ConsoleLogger() });
    }
    run(fnc) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const logger = new ConsoleLogger_1.ConsoleLogger();
            logger.blue(TestLogger_1.Indent.TestRig, ((_a = this.config) === null || _a === void 0 ? void 0 : _a.name) ? `Starting: ${this.config.name}` : 'Starting');
            try {
                yield fnc({
                    rig: this,
                    reporter: (_b = this.config) === null || _b === void 0 ? void 0 : _b.reporter,
                    createConnector: (config) => {
                        return new TestConnector_1.TestConnector(this, Object.assign(Object.assign({}, config), { logger: this.config.logger }));
                    },
                    test: (request) => __awaiter(this, void 0, void 0, function* () {
                        const test = new Test_1.Test({
                            rig: this,
                            logger: this.config.logger,
                        });
                        yield test.execute(request);
                    }),
                });
                logger.blue(TestLogger_1.Indent.TestRig, `${((_c = this.config) === null || _c === void 0 ? void 0 : _c.name) ? `Finished: ${this.config.name}` : 'Finished'} - Starting teardown`);
                yield this.performSuccessTeardown();
            }
            catch (error) {
                logger.red(TestLogger_1.Indent.TestRig, `${((_d = this.config) === null || _d === void 0 ? void 0 : _d.name) ? `Failed: ${this.config.name}` : 'Failed'} - Starting teardown`);
                yield this.performFailureTeardown();
            }
        });
    }
    addRigFailureTeardown(entry) {
        this.rigFailureTeardownEntries.unshift(entry);
    }
    addRigSuccessTeardown(entry) {
        this.rigSuccessTeardownEntries.unshift(entry);
    }
    removeRigFailureTeardown(id) {
        this.rigFailureTeardownEntries = this.rigFailureTeardownEntries.filter((t) => t.request.id != id);
    }
    removeRigSuccessTeardown(id) {
        this.rigSuccessTeardownEntries = this.rigSuccessTeardownEntries.filter((t) => t.request.id != id);
    }
    performSuccessTeardown() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            for (const entry of this.rigSuccessTeardownEntries) {
                try {
                    yield ((_b = (_a = entry.request).onRigSuccessTeardown) === null || _b === void 0 ? void 0 : _b.call(_a, entry.testStepResponseContext));
                }
                catch (error) {
                    // Only log, all teardown steps should be attempted
                }
            }
        });
    }
    performFailureTeardown() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            for (const entry of this.rigFailureTeardownEntries) {
                try {
                    yield ((_b = (_a = entry.request).onRigFailureTeardown) === null || _b === void 0 ? void 0 : _b.call(_a, entry.testStepResponseContext));
                }
                catch (error) {
                    // Only log, all teardown steps should be attempted
                }
            }
        });
    }
}
exports.TestRig = TestRig;
