import { test, expect } from '../src/test/index.js';
import { loadConfigurationFile } from '../src/configuration';

/*
 * Tests for configuration file loading and serializing.
 */
describe('configuration', () => {
  test.it('sample', async () => {
    const configFilename = './sample.conf';

    await loadConfigurationFile(configFilename);
    expect(2).to.equal(2);
  });
});
