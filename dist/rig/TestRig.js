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
const CompositeLogger_1 = require("../logger/CompositeLogger");
/**
 * The test rig keeps track of the execution of an integration test: running tests, keeping
 * track of any teardown necessary and producing test results.
 */
class TestRig {
    constructor(config) {
        this.rigFailureTeardownEntries = [];
        this.rigSuccessTeardownEntries = [];
        this.config = config;
        this.logger = this.createCompositeLogger(config === null || config === void 0 ? void 0 : config.loggers);
    }
    createCompositeLogger(loggers) {
        if ((loggers !== null && loggers !== void 0 ? loggers : []).length == 0) {
            loggers = [new ConsoleLogger_1.ConsoleLogger()];
        }
        return new CompositeLogger_1.CompositeLogger(loggers);
    }
    run(fnc) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_b = (_a = this.logger).setup) === null || _b === void 0 ? void 0 : _b.call(_a));
            this.logger.blue(TestLogger_1.Indent.TestRig, ((_c = this.config) === null || _c === void 0 ? void 0 : _c.name) ? `Starting: ${this.config.name}` : 'Starting');
            try {
                yield fnc({
                    rig: this,
                    reporter: (_d = this.config) === null || _d === void 0 ? void 0 : _d.reporter,
                    metadata: (_e = this.config) === null || _e === void 0 ? void 0 : _e.metadata,
                    createConnector: (config) => {
                        return new TestConnector_1.TestConnector(this, Object.assign(Object.assign({}, config), { logger: this.logger }));
                    },
                    test: (request) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const test = new Test_1.Test({
                                rig: this,
                                logger: this.logger,
                            });
                            return test.execute(request);
                        }
                        catch (error) {
                            this.logger.red(TestLogger_1.Indent.TestContent, error.message);
                            throw error;
                        }
                    }),
                });
                this.logger.blue(TestLogger_1.Indent.TestRig, ((_f = this.config) === null || _f === void 0 ? void 0 : _f.name) ? `Finished: ${this.config.name}` : 'Finished');
                yield this.performSuccessTeardown();
            }
            catch (error) {
                this.logger.red(TestLogger_1.Indent.TestRig, ((_g = this.config) === null || _g === void 0 ? void 0 : _g.name) ? `Failed: ${this.config.name}` : 'Failed');
                yield this.performFailureTeardown();
            }
            yield ((_j = (_h = this.logger).finish) === null || _j === void 0 ? void 0 : _j.call(_h));
        });
    }
    addRigFailureTeardown(entry) {
        this.rigFailureTeardownEntries.unshift(entry);
    }
    addRigSuccessTeardown(entry) {
        this.rigSuccessTeardownEntries.unshift(entry);
    }
    removeRigFailureTeardown(id) {
        const count = this.rigFailureTeardownEntries.length;
        this.rigFailureTeardownEntries = this.rigFailureTeardownEntries.filter((t) => t.request.id != id);
        return count - this.rigFailureTeardownEntries.length;
    }
    removeRigSuccessTeardown(id) {
        const count = this.rigSuccessTeardownEntries.length;
        this.rigSuccessTeardownEntries = this.rigSuccessTeardownEntries.filter((t) => t.request.id != id);
        return count - this.rigSuccessTeardownEntries.length;
    }
    performSuccessTeardown() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.rigSuccessTeardownEntries.length == 0) {
                return;
            }
            this.logger.blue(TestLogger_1.Indent.TestRig, 'Starting teardown after test success');
            for (const entry of this.rigSuccessTeardownEntries) {
                this.logger.white(TestLogger_1.Indent.TestHeader, `Tearing down on success: ${entry.request.id}`);
                try {
                    yield ((_b = (_a = entry.request).onRigSuccessTeardown) === null || _b === void 0 ? void 0 : _b.call(_a, entry.testStepResponseContext));
                }
                catch (error) {
                    // Only log, all teardown steps should be attempted
                }
            }
            this.logger.blue(TestLogger_1.Indent.TestRig, 'Teardown after test success completed');
        });
    }
    performFailureTeardown() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.rigFailureTeardownEntries.length == 0) {
                return;
            }
            this.logger.blue(TestLogger_1.Indent.TestRig, 'Starting teardown after test failure');
            for (const entry of this.rigFailureTeardownEntries) {
                this.logger.white(TestLogger_1.Indent.TestHeader, `Tearing down on failure: ${entry.request.id}`);
                try {
                    yield ((_b = (_a = entry.request).onRigFailureTeardown) === null || _b === void 0 ? void 0 : _b.call(_a, entry.testStepResponseContext));
                }
                catch (error) {
                    // Only log, all teardown steps should be attempted
                }
            }
            this.logger.blue(TestLogger_1.Indent.TestRig, 'Teardown after test failure completed');
        });
    }
}
exports.TestRig = TestRig;
