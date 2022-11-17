import * as fs from 'fs';
import * as path from 'path';
import { TestResponse } from '../connector/TestResponse';
import { OptionalTestReporterLoggers, TestReporter } from './TestReporter';

export interface FileReporterConfig {
  /**
   * Function that resolves the filename where the response JSON of a tests act()
   * method (typically a REST API call) should be stored. If this is not defined,
   * the test responses will not be persisted to file.
   */
  testResponseFileNameResolver?: (testId: string) => string;
  /**
   * The full path where the log rows text file should be stored
   * at the end of the test rig run. If this is not defined, the logs will not be
   * persisted to file.
   */
  logsFileName?: string;
}

/**
 * Test reporter that logs to file. This includes the responses from the tests, if
 * the FileReporterConfig.testResponseFileNameResolver property is set.
 *
 * If the path of a file that is about to be written by the reporter doesn't exist,
 * the reporter will try to create it.
 */
export class FileReporter implements TestReporter {
  private config: FileReporterConfig;
  private logRows: string[] = [];

  log: OptionalTestReporterLoggers = {
    rig: {
      info: (msg) => this.logRow(0, msg),
      error: (msg) => this.logRow(0, msg),
      success: (msg) => this.logRow(0, msg),
    },
    test: {
      info: (msg) => this.logRow(1, msg),
      error: (msg) => this.logRow(1, msg),
      success: (msg) => this.logRow(1, msg),
    },
    testStep: {
      info: (msg) => this.logRow(2, msg),
      error: (msg) => this.logRow(2, msg),
      success: (msg) => this.logRow(2, msg),
    },
  };

  constructor(config: FileReporterConfig) {
    this.config = config;
  }

  async reportTestResponse(testId: string, response: TestResponse) {
    const fileName = this.config.testResponseFileNameResolver?.(testId);
    if (fileName) {
      await this.writeFile({
        fileName,
        fileContents: JSON.stringify(response, null, 2),
      });
    }
  }

  async finish() {
    const fileName = this.config.logsFileName;
    if (fileName) {
      await this.writeFile({
        fileName,
        fileContents: this.logRows.join('\r\n'),
      });
    }
  }

  private logRow(indent: number, msg: string) {
    this.logRows.push(`${' '.repeat(indent * 2)}${msg}`);
  }

  private async writeFile(params: { fileName: string; fileContents: string }): Promise<void> {
    const filePath = path.dirname(params.fileName);
    fs.mkdirSync(filePath, { recursive: true });
    fs.writeFileSync(params.fileName, params.fileContents);
  }
}
