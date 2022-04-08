import { TestRig } from './TestRig';
export declare class TestConnector {
    private rig;
    private config;
    constructor(rig: TestRig, config: TestConnectorConfig);
}
export interface TestConnectorConfig {
}
