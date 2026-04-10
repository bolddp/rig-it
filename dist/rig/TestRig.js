"use strict";
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
    config;
    reporter;
    rigFailureTeardownEntries = [];
    rigSuccessTeardownEntries = [];
    testIds = [];
    constructor(config) {
        this.config = config;
        this.reporter = this.createCompositeReporter(config?.reporters);
    }
    createCompositeReporter(reporters) {
        if ((reporters ?? []).length == 0) {
            reporters = [new ConsoleReporter_1.ConsoleReporter()];
        }
        return new CompositeReporter_1.CompositeReporter(reporters);
    }
    /**
     * Runs the test rig, keeping track of the test in it and performing teardown, logging etc.
     */
    async run(fnc) {
        const result = {
            success: true,
            durationsMs: {},
        };
        await this.reporter.setup?.();
        this.reporter.log?.rig?.info?.(this.config?.name ? `Starting: ${this.config.name}` : 'Starting');
        try {
            await fnc({
                logger: {
                    info: (msg) => this.reporter.log?.test?.info?.(msg),
                    success: (msg) => this.reporter.log?.test?.success?.(msg),
                    error: (msg) => this.reporter.log?.test?.error?.(msg),
                },
                createConnector: (config) => {
                    return (this.config?.testConnectorFactory?.(config, this.reporter) ??
                        new TestConnector_1.TestConnector(config, this.reporter));
                },
                test: async (request) => {
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
                        const rsp = await test.execute(request);
                        result.durationsMs[request.id] = Date.now() - ts;
                        return rsp;
                    }
                    catch (error) {
                        result.durationsMs[request.id] = Date.now() - ts;
                        this.reporter.log?.testStep?.error?.(error.message);
                        throw error;
                    }
                },
            });
            this.reporter.log?.rig?.success?.(this.config?.name ? `Finished: ${this.config.name}` : 'Finished');
            await this.performSuccessTeardown();
        }
        catch (error) {
            result.success = false;
            this.reporter.log?.rig?.error?.(this.config?.name ? `Failed: ${this.config.name}` : 'Failed');
            await this.performFailureTeardown();
        }
        await this.reporter.finish?.(result);
        return result;
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
    async performSuccessTeardown() {
        if (this.rigSuccessTeardownEntries.length == 0) {
            return;
        }
        this.reporter.log?.rig?.info?.('Starting teardown after test success');
        for (const entry of this.rigSuccessTeardownEntries) {
            this.reporter.log?.test?.info?.(`Tearing down on success: ${entry.request.id}`);
            try {
                await entry.request.rigSuccessTeardown?.(entry.testStepResponseContext);
            }
            catch (error) {
                // Only log, to allow all teardown steps to be attempted
                this.reporter.log?.rig?.error?.(`Error during teardown of test '${entry.request.id}': ${error.message}`);
            }
        }
        this.reporter.log?.rig?.info?.('Teardown after test success completed');
    }
    async performFailureTeardown() {
        if (this.rigFailureTeardownEntries.length == 0) {
            return;
        }
        this.reporter.log?.rig?.info?.('Starting teardown after test failure');
        for (const entry of this.rigFailureTeardownEntries) {
            this.reporter.log?.test?.info?.(`Tearing down on failure: ${entry.request.id}`);
            try {
                await entry.request.rigFailureTeardown?.(entry.testStepResponseContext);
            }
            catch (error) {
                // Only log, all teardown steps should be attempted
                this.reporter.log?.rig?.error?.(`Error during teardown of test '${entry.request.id}': ${error.message}`);
            }
        }
        this.reporter.log?.rig?.info?.('Teardown after test failure completed');
    }
}
exports.TestRig = TestRig;
