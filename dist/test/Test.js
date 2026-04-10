"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = void 0;
class Test {
    config;
    constructor(config) {
        this.config = config;
    }
    async execute(request) {
        const ctx = {
            logger: {
                info: (msg) => this.config.reporter.log?.testStep?.info?.(msg),
                success: (msg) => this.config.reporter.log?.testStep?.success?.(msg),
                error: (msg) => this.config.reporter.log?.testStep?.error?.(msg),
            },
            removeFailureTeardown: (id) => {
                const count = this.config.rig.removeRigFailureTeardown(id);
                this.config.reporter.log?.testStep?.info?.(`Removed ${count} failure teardown for test ${id}`);
            },
            removeSuccessTeardown: (id) => {
                const count = this.config.rig.removeRigSuccessTeardown(id);
                this.config.reporter.log?.testStep?.info?.(`Removed ${count} success teardown for test ${id}`);
            },
        };
        this.config.reporter.log?.test?.info?.(`Test: ${request.id}`);
        if (request.assert && request.assertError) {
            throw new Error(`Invalid setup for test ${request.id}: either assert() or assertError() can be set but not both`);
        }
        await request.arrange?.(ctx);
        const response = await request.act(ctx);
        this.config.reporter.reportTestResponse?.(request.id, response);
        const testStepResponseContext = {
            ...ctx,
            response,
        };
        if (response.isOk) {
            if (!request.assertError) {
                // Expected and got success
                // Adding teardown entry before the assertion to get proper teardown
                this.addTeardownEntries({ request, testStepResponseContext });
                try {
                    await request.assert?.(testStepResponseContext);
                    this.config.reporter?.log?.testStep?.success?.('Test succeeded');
                }
                catch (error) {
                    throw new Error(`Assertion failed! ${error.message.replace(/[\r\n]/g, ', ')}`);
                }
            }
            else {
                // Expected failure, got success
                // this.config.logger?.red(Indent.TestContent, 'Test succeeded when expected to fail');
                throw new Error('Unexpected success');
            }
        }
        else {
            if (!request.assertError) {
                // Expected success, but the test failed
                // this.config.logger?.red(Indent.TestContent, 'Test failed');
                throw new Error('Unexpected failure');
            }
            else {
                // Expected and got failure
                this.config.reporter?.log?.testStep?.success?.('Test failed, which was expected');
                this.addTeardownEntries({ request, testStepResponseContext });
                await request.assertError?.(testStepResponseContext);
            }
        }
        return response.data;
    }
    addTeardownEntries(entry) {
        if (entry.request.rigSuccessTeardown) {
            this.config.rig.addRigSuccessTeardown(entry);
        }
        if (entry.request.rigFailureTeardown) {
            this.config.rig.addRigFailureTeardown(entry);
        }
    }
}
exports.Test = Test;
