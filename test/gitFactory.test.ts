import GitFactory = require('../src/gitFactory');
import GitLabService = require('../src/gitlab/gitlabService');
import Config = require('../src/interfaces/config');

describe('GitFactory', () => {
  describe('Create gitService from service name in config', () => {
    test('When service is empty, then should throw error that is is not a supported git service', () => {
      const config: Config = {
        service: '',
        serviceUrl: '',
        sections: [],
      };
      expect(() => new GitFactory(config).create()).toThrow('unsupported git service');
    });

    test('When service is gitlab, then should create gitlabService', () => {
      const config: Config = {
        service: 'gitlab',
        serviceUrl: '',
        sections: [],
      };
      expect(new GitFactory(config).create()).toBeInstanceOf(GitLabService);
    });
  });
});
