import { Command, flags } from '@oclif/command';
import * as dotenv from 'dotenv';

import { read } from './configReader';

import ChangelogGenerator = require('./changelogGenerator');
import GitFactory = require('./gitFactory');

class GitCG extends Command {
  static description = 'Gitlab Changelog Generator';

  static flags = {
    milestone: flags.string({ char: 'm', description: 'title of milestone' }),
    projectPath: flags.string({ description: 'path to project' }),
  };

  applyIfLocalEnvironment() {
    if (process.env.NODE_ENV === 'local') {
      console.log(`You are running ${process.env.NODE_ENV} environment`);
      dotenv.config();
    }
  }

  async run() {
    this.applyIfLocalEnvironment();

    const { args, flags } = this.parse(GitCG);

    const config = read('./gitcg-config.json');

    const gitService = new GitFactory(config).create();

    const changelogGenerator = new ChangelogGenerator(config, gitService, flags.milestone, flags.projectPath);
    const changelog = await changelogGenerator.generate();

    console.log(changelog);
  }
}

export = GitCG;
