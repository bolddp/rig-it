import { TestReporter } from '../reporter/TestReporter';
import { TestSetup } from '../test/TestSetup';
import { TestRigRunContext } from './TestRigRunContext';
import { TestStepResponseContext } from '../test/TestStepContext';
export declare type TestRigRunFunction = (ctx: TestRigRunContext) => Promise<any>;
export interface TestRigConfig {
    reporters?: TestReporter[];
    name?: string;
}
export interface TeardownEntry {
    request: TestSetup;
    testStepResponseContext: TestStepResponseContext;
}
/**
 * The test rig keeps track of the execution of an integration test: running tests, keeping
 * track of any teardown necessary and producing test results.
 */
export declare class TestRig {
    private config?;
    private reporter;
    private rigFailureTeardownEntries;
    private rigSuccessTeardownEntries;
    private testIds;
    constructor(config?: TestRigConfig);
    private createCompositeReporter;
    getConfig(): TestRigConfig | undefined;
    /**
     * Runs the test rig, keeping track of the test in it and performing teardown, logging etc.
     */
    run(fnc: TestRigRunFunction): Promise<void>;
    addRigFailureTeardown(entry: TeardownEntry): void;
    addRigSuccessTeardown(entry: TeardownEntry): void;
    removeRigFailureTeardown(id: string): number;
    removeRigSuccessTeardown(id: string): number;
    performSuccessTeardown(): Promise<void>;
    performFailureTeardown(): Promise<void>;
}
