import { TestLogger } from '../logger/TestLogger';
import { TestRig } from '../rig/TestRig';
import { TestSetup } from './TestSetup';
export declare class Test {
    private config;
    constructor(config: TestConfig);
    execute(request: TestSetup): Promise<any>;
    private addTeardownEntries;
}
export interface TestConfig {
    rig: TestRig;
    logger: TestLogger;
}
