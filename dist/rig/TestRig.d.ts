import { TestLogger } from '../logger/TestLogger';
import { TestReporter } from '../reporter/TestReporter';
import { TestRigRunContext } from './TestRigRunContext';
import { TeardownEntry } from './TeardownEntry';
/**
 * The test rig keeps track of the execution of an integration test: running tests, keeping
 * track of any teardown necessary and producing test results.
 */
export declare class TestRig {
    private config;
    private rigFailureTeardownEntries;
    private rigSuccessTeardownEntries;
    constructor(config?: TestRigConfig);
    run(fnc: (ctx: TestRigRunContext) => Promise<any>): Promise<void>;
    addRigFailureTeardown(entry: TeardownEntry): void;
    addRigSuccessTeardown(entry: TeardownEntry): void;
    removeRigFailureTeardown(id: string): void;
    removeRigSuccessTeardown(id: string): void;
    performSuccessTeardown(): Promise<void>;
    performFailureTeardown(): Promise<void>;
}
export interface TestRigConfig {
    logger?: TestLogger;
    name?: string;
    reporter?: TestReporter;
}
