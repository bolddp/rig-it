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
const ConsoleReporter_1 = require("../reporter/ConsoleReporter");
const Test_1 = require("../test/Test");
const CompositeReporter_1 = require("../reporter/CompositeReporter");
/**
 * The test rig keeps track of the execution of an integration test: running tests, keeping
 * track of any teardown necessary and producing test results.
 */
class TestRig {
    constructor(config) {
        this.rigFailureTeardownEntries = [];
        this.rigSuccessTeardownEntries = [];
        this.testIds = [];
        this.config = config;
        this.reporter = this.createCompositeReporter(config === null || config === void 0 ? void 0 : config.reporters);
    }
    createCompositeReporter(reporters) {
        if ((reporters !== null && reporters !== void 0 ? reporters : []).length == 0) {
            reporters = [new ConsoleReporter_1.ConsoleReporter()];
        }
        return new CompositeReporter_1.CompositeReporter(reporters);
    }
    /**
     * Runs the test rig, keeping track of the test in it and performing teardown, logging etc.
     */
    run(fnc) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        return __awaiter(this, void 0, void 0, function* () {
            const result = {
                success: true,
                durationsMs: {},
            };
            yield ((_b = (_a = this.reporter).setup) === null || _b === void 0 ? void 0 : _b.call(_a));
            (_e = (_d = (_c = this.reporter.log) === null || _c === void 0 ? void 0 : _c.rig) === null || _d === void 0 ? void 0 : _d.info) === null || _e === void 0 ? void 0 : _e.call(_d, ((_f = this.config) === null || _f === void 0 ? void 0 : _f.name) ? `Starting: ${this.config.name}` : 'Starting');
            try {
                yield fnc({
                    logger: {
                        info: (msg) => { var _a, _b, _c; return (_c = (_b = (_a = this.reporter.log) === null || _a === void 0 ? void 0 : _a.test) === null || _b === void 0 ? void 0 : _b.info) === null || _c === void 0 ? void 0 : _c.call(_b, msg); },
                        success: (msg) => { var _a, _b, _c; return (_c = (_b = (_a = this.reporter.log) === null || _a === void 0 ? void 0 : _a.test) === null || _b === void 0 ? void 0 : _b.success) === null || _c === void 0 ? void 0 : _c.call(_b, msg); },
                        error: (msg) => { var _a, _b, _c; return (_c = (_b = (_a = this.reporter.log) === null || _a === void 0 ? void 0 : _a.test) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.call(_b, msg); },
                    },
                    createConnector: (config) => {
                        var _a, _b, _c;
                        return ((_c = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.testConnectorFactory) === null || _b === void 0 ? void 0 : _b.call(_a, config, this.reporter)) !== null && _c !== void 0 ? _c : new TestConnector_1.TestConnector(config, this.reporter));
                    },
                    test: (request) => __awaiter(this, void 0, void 0, function* () {
                        var _s, _t, _u;
                        const ts = Date.now();
                        try {
                            if (this.testIds.includes(request.id)) {
                                throw new Error(`Duplicate test id: ${request.id}`);
                            }
                            else {
                                this.testIds.push(request.id);
                            }
                            const test = new Test_1.Test({
                                rig: this,
                                reporter: this.reporter,
                            });
                            const rsp = yield test.execute(request);
                            result.durationsMs[request.id] = Date.now() - ts;
                            return rsp;
                        }
                        catch (error) {
                            result.durationsMs[request.id] = Date.now() - ts;
                            (_u = (_t = (_s = this.reporter.log) === null || _s === void 0 ? void 0 : _s.testStep) === null || _t === void 0 ? void 0 : _t.error) === null || _u === void 0 ? void 0 : _u.call(_t, error.message);
                            throw error;
                        }
                    }),
                });
                (_j = (_h = (_g = this.reporter.log) === null || _g === void 0 ? void 0 : _g.rig) === null || _h === void 0 ? void 0 : _h.success) === null || _j === void 0 ? void 0 : _j.call(_h, ((_k = this.config) === null || _k === void 0 ? void 0 : _k.name) ? `Finished: ${this.config.name}` : 'Finished');
                yield this.performSuccessTeardown();
            }
            catch (error) {
                result.success = false;
                (_o = (_m = (_l = this.reporter.log) === null || _l === void 0 ? void 0 : _l.rig) === null || _m === void 0 ? void 0 : _m.error) === null || _o === void 0 ? void 0 : _o.call(_m, ((_p = this.config) === null || _p === void 0 ? void 0 : _p.name) ? `Failed: ${this.config.name}` : 'Failed');
                yield this.performFailureTeardown();
            }
            yield ((_r = (_q = this.reporter).finish) === null || _r === void 0 ? void 0 : _r.call(_q, result));
            return result;
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.rigSuccessTeardownEntries.length == 0) {
                return;
            }
            (_c = (_b = (_a = this.reporter.log) === null || _a === void 0 ? void 0 : _a.rig) === null || _b === void 0 ? void 0 : _b.info) === null || _c === void 0 ? void 0 : _c.call(_b, 'Starting teardown after test success');
            for (const entry of this.rigSuccessTeardownEntries) {
                (_f = (_e = (_d = this.reporter.log) === null || _d === void 0 ? void 0 : _d.test) === null || _e === void 0 ? void 0 : _e.info) === null || _f === void 0 ? void 0 : _f.call(_e, `Tearing down on success: ${entry.request.id}`);
                try {
                    yield ((_h = (_g = entry.request).rigSuccessTeardown) === null || _h === void 0 ? void 0 : _h.call(_g, entry.testStepResponseContext));
                }
                catch (error) {
                    // Only log, to allow all teardown steps to be attempted
                    (_l = (_k = (_j = this.reporter.log) === null || _j === void 0 ? void 0 : _j.rig) === null || _k === void 0 ? void 0 : _k.error) === null || _l === void 0 ? void 0 : _l.call(_k, `Error during teardown of test '${entry.request.id}': ${error.message}`);
                }
            }
            (_p = (_o = (_m = this.reporter.log) === null || _m === void 0 ? void 0 : _m.rig) === null || _o === void 0 ? void 0 : _o.info) === null || _p === void 0 ? void 0 : _p.call(_o, 'Teardown after test success completed');
        });
    }
    performFailureTeardown() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.rigFailureTeardownEntries.length == 0) {
                return;
            }
            (_c = (_b = (_a = this.reporter.log) === null || _a === void 0 ? void 0 : _a.rig) === null || _b === void 0 ? void 0 : _b.info) === null || _c === void 0 ? void 0 : _c.call(_b, 'Starting teardown after test failure');
            for (const entry of this.rigFailureTeardownEntries) {
                (_f = (_e = (_d = this.reporter.log) === null || _d === void 0 ? void 0 : _d.test) === null || _e === void 0 ? void 0 : _e.info) === null || _f === void 0 ? void 0 : _f.call(_e, `Tearing down on failure: ${entry.request.id}`);
                try {
                    yield ((_h = (_g = entry.request).rigFailureTeardown) === null || _h === void 0 ? void 0 : _h.call(_g, entry.testStepResponseContext));
                }
                catch (error) {
                    // Only log, all teardown steps should be attempted
                    (_l = (_k = (_j = this.reporter.log) === null || _j === void 0 ? void 0 : _j.rig) === null || _k === void 0 ? void 0 : _k.error) === null || _l === void 0 ? void 0 : _l.call(_k, `Error during teardown of test '${entry.request.id}': ${error.message}`);
                }
            }
            (_p = (_o = (_m = this.reporter.log) === null || _m === void 0 ? void 0 : _m.rig) === null || _o === void 0 ? void 0 : _o.info) === null || _p === void 0 ? void 0 : _p.call(_o, 'Teardown after test failure completed');
        });
    }
}
exports.TestRig = TestRig;
