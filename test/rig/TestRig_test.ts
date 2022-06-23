import { TestConnector } from '../../src/connector/TestConnector';
import { ConsoleReporter } from '../../src/reporter/ConsoleReporter';
import { TestReporter } from '../../src/reporter/TestReporter';
import { TestRig, TestRigConfig } from '../../src/rig/TestRig';

describe('TestRig', () => {
  let testReporter: TestReporter;
  let testConnector: TestConnector;
  let testRigConfig: TestRigConfig;
  let sut: TestRig;

  beforeEach(() => {
    testReporter = {
      setup: jest.fn(),
      log: {
        rig: {
          error: jest.fn(),
          info: jest.fn(),
          success: jest.fn(),
        },
        test: {
          error: jest.fn(),
          info: jest.fn(),
          success: jest.fn(),
        },
        testStep: {
          error: jest.fn(),
          info: jest.fn(),
          success: jest.fn(),
        },
      },
    };

    testConnector = <any>{};

    testRigConfig = {
      name: 'testRig',
      reporters: [testReporter, new ConsoleReporter()],
      testConnectorFactory: jest.fn(),
    };
    sut = new TestRig(testRigConfig);
  });

  it('will run test that finishes OK', async () => {
    const testSetup = {
      id: 'testId',
      act: jest.fn().mockResolvedValue({ isOk: true }),
      rigSuccessTeardown: jest.fn(),
    };

    await sut.run(async (ctx) => {
      ctx.logger.info('log info at test level');
      ctx.logger.error('log error at test level');
      ctx.logger.success('log success at test level');

      const connector = ctx.createConnector({
        baseUrl: 'http://url.com',
        authHeaders: {
          Authorization: 'TOKEN auth',
        },
        timeoutMs: 5000,
      });

      expect(connector).toBeDefined();

      await ctx.test(testSetup);
    });

    expect(testReporter.log?.rig?.info).toHaveBeenCalledWith('Starting: testRig');
    expect(testReporter.log?.test?.info).toHaveBeenCalledWith('log info at test level');
    expect(testReporter.log?.test?.error).toHaveBeenCalledWith('log error at test level');
    expect(testReporter.log?.test?.success).toHaveBeenCalledWith('log success at test level');

    expect(testRigConfig.testConnectorFactory).toHaveBeenCalledWith(
      {
        baseUrl: 'http://url.com',
        authHeaders: {
          Authorization: 'TOKEN auth',
        },
        timeoutMs: 5000,
      },
      expect.anything()
    );

    expect(testReporter.setup).toHaveBeenCalled();

    expect(testSetup.act).toHaveBeenCalled();

    expect(testSetup.rigSuccessTeardown).toHaveBeenCalledWith({
      logger: expect.anything(),
      removeFailureTeardown: expect.anything(),
      removeSuccessTeardown: expect.anything(),
      response: {
        isOk: true,
      },
    });
    expect(testReporter.log?.rig?.success).toHaveBeenCalledWith('Finished: testRig');
  });

  it('will add and remove failure teardown', async () => {
    const rigFailureTeardown = jest.fn();

    await sut.run(async (ctx) => {
      await ctx.test({
        id: 'test01',
        act: async (ctx) => {
          return { isOk: true };
        },
        rigFailureTeardown,
      });

      await ctx.test({
        id: 'test02',
        act: async (ctx) => {
          ctx.removeFailureTeardown('test01');
          return { isOk: false };
        },
      });
    });

    expect(rigFailureTeardown).not.toHaveBeenCalled();
  });

  it('will add and remove success teardown', async () => {
    const rigSuccessTeardown = jest.fn();

    await sut.run(async (ctx) => {
      await ctx.test({
        id: 'test01',
        act: async (ctx) => {
          return { isOk: true };
        },
        rigSuccessTeardown,
      });

      await ctx.test({
        id: 'test02',
        act: async (ctx) => {
          ctx.removeSuccessTeardown('test01');
          return { isOk: false };
        },
      });
    });

    expect(rigSuccessTeardown).not.toHaveBeenCalled();
  });

  it('will throw on duplicate test ids', async () => {
    const testSetup1 = {
      id: 'duplicateId',
      act: jest.fn().mockResolvedValue({ isOk: true }),
      rigFailureTeardown: jest.fn(),
    };
    const testSetup2 = {
      id: 'duplicateId',
      act: jest.fn(),
      rigFailureTeardown: jest.fn(),
    };

    await sut.run(async (ctx) => {
      await ctx.test(testSetup1);
      await ctx.test(testSetup2);
    });

    expect(testReporter.log?.testStep?.error).toHaveBeenCalledWith(
      'Duplicate test id: duplicateId'
    );
    expect(testSetup1.act).toHaveBeenCalled();
    expect(testSetup2.act).not.toHaveBeenCalled();

    expect(testSetup1.rigFailureTeardown).toHaveBeenCalled();
    expect(testSetup2.rigFailureTeardown).not.toHaveBeenCalled();
    expect(testReporter.log?.rig?.error).toHaveBeenCalledWith('Failed: testRig');
  });

  it('create default console reporter', async () => {
    const rig = new TestRig({
      name: 'testRig',
    });

    const rigFailureTeardown = jest.fn();
    await rig.run(async (ctx) => {
      await ctx.test({
        id: 'test01',
        act: async (testCtx) => {
          return { isOk: true };
        },
        rigFailureTeardown,
      });
      await ctx.test({
        id: 'test02',
        act: async (testCtx) => {
          return {
            isOk: testCtx.logger != undefined,
          };
        },
      });
    });

    expect(rigFailureTeardown).not.toHaveBeenCalled();
  });
});
