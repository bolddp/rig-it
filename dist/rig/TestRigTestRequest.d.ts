import expect from 'expect';
import { TestResponse } from '../connector/TestResponse';
export interface TestRigTestRequest {
    testName: string;
    setup?: () => Promise<void>;
    execute: () => Promise<TestResponse>;
    assert?: (rsp: TestResponse, expct: typeof expect) => Promise<void>;
    assertError?: (rsp: TestResponse) => Promise<void>;
    /**
     * Add cleanup code here, e.g. deletion of a resource that the test creates, that should be run
     * only if the test rig fails at some point.
     *
     * When the rig fails, the onRigFailure functions that have been encountered will be executed in
     * reverse order of how they were declared, e.g. the onRigFailure code of an early test will be
     * executed after the onRigFailure code of a later test.
     */
    onRigFailure?: (rsp: TestResponse) => Promise<void>;
    /**
     * Add cleanup code here, e.g. deletion of a resource that the test creates, that should be run
     * only if the test rig succeeds.
     */
    onRigSuccess?: (rsp: TestResponse) => Promise<void>;
}
