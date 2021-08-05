import Config = require('./interfaces/config');
import MergeRequest = require('./interfaces/milestone');

abstract class GitService {
  protected config: Config;

  public constructor(config: Config) {
    this.config = config;
  }

  abstract getMergeRequests(milestone: string, projectPath: string): Promise<Array<MergeRequest>>;

  abstract getCommitUrl(commitSha: string, projectPath: string): string;
}

export = GitService;
