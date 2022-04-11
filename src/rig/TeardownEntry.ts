import { TestSetup } from '../test/TestSetup';
import { TestStepResponseContext } from '../test/TestStepContext';

export interface TeardownEntry {
  request: TestSetup;
  testStepResponseContext: TestStepResponseContext;
}
