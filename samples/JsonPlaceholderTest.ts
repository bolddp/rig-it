import expect from 'expect';
import { ConsoleReporter } from '../src/reporter/ConsoleReporter';
import { FileReporter } from '../src/reporter/FileReporter';
import { HtmlReporter } from '../src/reporter/HtmlReporter';
import { TestRig } from '../src/rig/TestRig';
import { TestRigRunContext } from '../src/rig/TestRigRunContext';
/**
 * Sample test running against the fake API at https://jsonplaceholder.typicode.com/
 *
 * For this to work, we need to perform some tweaks, e.g. expect a POST to return 201 but
 * the data won't be available at the reported id. The tweaks are pointed out in the comments.
 */

/**
 * Create the rig, giving it a name and specifying what test reporters you want to use. If no
 * reporters are specified, a {@link ConsoleReporter} will be used.
 */
const testRig = new TestRig({
  name: 'JSON Placeholder API',
  reporters: [
    new ConsoleReporter(),
    new FileReporter({
      testResponseFileNameResolver: (testId) => `sample-test-result/${testId}.json`,
      logsFileName: 'sample-test-result/logs.txt',
    }),
    new HtmlReporter({
      fileName: 'sample-test-result/logs.html',
    }),
  ],
});

testRig.run(async (testContext: TestRigRunContext) => {
  // Create a connector
  const connector = testContext.createConnector({
    baseUrl: 'https://jsonplaceholder.typicode.com',
    timeoutMs: 5000,
  });

  // If necessary for your use case, obtain credentials and set them on the connector.
  // const token = AuthProvider.getToken('username', 'password');
  // connector.setHeader('Authorization', `Bearer ${token}`);

  // Add your own customized log rows where necessary
  testContext.logger.info('Customized logging: Authentication succeeded!');

  // Create blog post
  const newPost = await testContext.test({
    id: 'create.post',
    act: async (ctx) => {
      return connector.post({
        url: '/posts',
        body: { title: 'foo', body: 'bar', userId: 1 },
      });
    },
    rigFailureTeardown: async (ctx) => {
      // If we end up here due to a test rig failure at some later point, the result from the act()
      // function is available in the context so we can delete the correct post
      const postId = ctx.response?.data?.id;
      await connector.delete({
        url: `/posts/${postId}`,
      });
    },
    rigSuccessTeardown: async (ctx) => {
      // You can also add customized logging here
      ctx.logger.success(
        `Customized logging: Tearing down create.post after success test rig run!`
      );
    },
  });

  // Establish the id of the new post, we need it for subsequent tests
  const postId = newPost.id;

  // Read back the post to make sure it's there (TWEAK! use id: 100 since we're using a mock API)
  await testContext.test({
    id: 'get.post',
    act: async (ctx) => {
      return connector.get({ url: `/posts/100` });
    },
    assert: async (ctx) => {
      expect(ctx.response?.data?.id).toBe(100);
    },
  });

  // We want deletion of the post to be part of the test as well, even though it's also deleted
  // on test rig failure.
  await testContext.test({
    id: 'delete.post',
    act: async (ctx) => {
      // Now it's no longer necessary to delete this post as part of failure teardown, so we remove it.
      // If we hadn't, that teardown step would have failed with a 404, but failures during teardown
      // are ignored, so any other teardown steps that were scheduled for execution would have been
      // carried out anyway.
      ctx.removeFailureTeardown('create.post');

      return await connector.delete({ url: `/posts/${postId}` });
    },
  });
});
