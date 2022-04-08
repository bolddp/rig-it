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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRig = void 0;
const expect_1 = __importDefault(require("expect"));
const TestConnector_1 = require("../connector/TestConnector");
const Loggers_1 = require("../Loggers");
/**
 * The test rig keeps track of the execution of an integration test: running tests, keeping
 * track of any teardown necessary and producing test results.
 */
class TestRig {
    constructor(config) {
        this.config = config;
    }
    createConnector(config) {
        return new TestConnector_1.TestConnector(this, Object.assign(Object.assign({}, config), { log: new Loggers_1.TestConnectorLogger() }));
    }
    test(request) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const testLogger = new Loggers_1.TestLogger();
            testLogger.log(`Test: ${request.testName}`);
            yield ((_a = request.setup) === null || _a === void 0 ? void 0 : _a.call(request));
            const rsp = yield request.execute();
            yield ((_b = request.assert) === null || _b === void 0 ? void 0 : _b.call(request, rsp, expect_1.default));
            yield ((_c = request.assertError) === null || _c === void 0 ? void 0 : _c.call(request, rsp));
            yield ((_d = request.onRigFailure) === null || _d === void 0 ? void 0 : _d.call(request, rsp));
        });
    }
    run(fnc) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const rigLog = new Loggers_1.TestRigLogger();
            rigLog.info(((_a = this.config) === null || _a === void 0 ? void 0 : _a.name) ? `Starting: ${this.config.name}` : 'Starting');
            yield fnc({
                rig: this,
                reporter: (_b = this.config) === null || _b === void 0 ? void 0 : _b.reporter,
                createConnector: this.createConnector,
                test: this.test,
            });
            rigLog.info(((_c = this.config) === null || _c === void 0 ? void 0 : _c.name) ? `Finished: ${this.config.name}` : 'Finished');
        });
    }
}
exports.TestRig = TestRig;
