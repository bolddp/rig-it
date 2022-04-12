import { TestReporter } from '../reporter/TestReporter';
import { TestRig } from '../rig/TestRig';
import { TestSetup } from './TestSetup';
export interface TestConfig {
    rig: TestRig;
    reporter: TestReporter;
}
export declare class Test {
    private config;
    constructor(config: TestConfig);
    execute(request: TestSetup): Promise<any>;
    private addTeardownEntries;
}
