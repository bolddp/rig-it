import { TestResponse } from '../connector/TestResponse';

export interface TestReporter {
  setup?(): Promise<void>;
  printWhite(indent: Indent, msg: string): void;
  printBlue(indent: Indent, msg: string): void;
  printGreen(indent: Indent, msg: string): void;
  printRed(indent: Indent, msg: string): void;
  printGray(indent: Indent, msg: string): void;

  reportTestResponse?(testId: string, response: TestResponse): Promise<void>;
  finish?(success: boolean): Promise<void>;
}

export enum Indent {
  TestRig = 0,
  TestHeader = 1,
  TestContent = 2,
}
