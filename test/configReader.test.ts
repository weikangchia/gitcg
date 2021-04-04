import { read } from '../src/configReader';

describe('ConfigReader', () => {
  describe('Read config from file', () => {
    test('When file does not exist, then should not throw error', () => {
      const config = read('');
      expect(config.service).toBe(undefined);
      expect(config.serviceUrl).toBe(undefined);
      expect(config.sections).toBe(undefined);
    });
  });
});
