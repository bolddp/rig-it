import { TestResponse } from '../connector/TestResponse';
import { TestRigRunResult } from '../rig/TestRig';

export interface TestReporter {
  setup?(): Promise<void>;
  log?: OptionalTestReporterLoggers;

  reportTestResponse?(testId: string, response: TestResponse): Promise<void>;
  finish?(result: TestRigRunResult): Promise<void>;
}

export interface TestReporterLogger {
  info: (msg: string) => void;
  success: (msg: string) => void;
  error: (msg: string) => void;
}

export interface OptionalTestReporterLoggers {
  rig?: OptionalTestReporterLogger;
  test?: OptionalTestReporterLogger;
  testStep?: OptionalTestReporterLogger;
}

export interface OptionalTestReporterLogger {
  /**
   * Logs informational messages about actions that are taken etc.
   */
  info?: (msg: string) => void;
  /**
   * Logs a successful operation, e.g. a valid API call
   */
  success?: (msg: string) => void;
  /**
   * Logs a failed operation, e.g. data being absent etc.
   */
  error?: (msg: string) => void;
}
