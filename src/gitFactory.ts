import GitLabService = require('./gitlab/gitlabService');
import GitService = require('./gitService');
import Config = require('./interfaces/config');

class GitFactory {
  #config: Config;

  constructor(config: Config) {
    this.#config = config;
  }

  create(): GitService {
    if (this.#config.service === 'gitlab') {
      return new GitLabService(this.#config);
    }

    throw new Error('unsupported git service');
  }
}

export = GitFactory;
