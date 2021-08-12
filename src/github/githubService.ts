import * as path from 'path';
import { gql, GraphQLClient } from 'graphql-request';

import GitService = require('../gitService');
import Config = require('../interfaces/config');
import MergeRequest = require('../interfaces/milestone');
import { ConsoleWriter } from 'istanbul-lib-report';

class GitHubService extends GitService {
  #client: GraphQLClient;

  constructor(config: Config) {
    super(config);

    this.#client = new GraphQLClient('https://api.github.com/graphql', {
      headers: {
        authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    });
  }

  async getMergeRequests(milestone: string, projectPath: string): Promise<Array<MergeRequest>> {
    const projectPathSplit = projectPath.split('/');
    const query = gql`
      {
        repository(owner: "${projectPathSplit[0]}", name: "${projectPathSplit[1]}") {
          milestones(query: "${milestone}", first: 1) {
            nodes {
              title
              pullRequests(states: MERGED, first: 100) {
                nodes {
                  title
                  labels(first: 100) {
                    nodes {
                      name
                    }
                  }
                  participants(first: 100) {
                    nodes {
                      login
                    }
                  }
                  mergeCommit {
                    oid
                  }
                }
              }
            }
          }
        }
      }
    `;

    let data;

    try {
      data = await this.#client.request(query);
    } catch (ex) {
      console.error(
        'Unable to retrieve data from your GitHub, please check that your GitHub token, projectPath and your serviceUrl are correct.',
      );
      process.exit(1);
    }

    this.validateRequestData(data);

    const pullRequests = data.repository.milestones.nodes[0].pullRequests.nodes;

    return pullRequests.map((pullRequest: any) => {
      const labels = pullRequest.labels.nodes.map((label: any) => label.name);
      const participants = pullRequest.participants.nodes.map((participant: any) => participant.login);

      return {
        title: pullRequest.title,
        labels,
        participants,
        commitSha: pullRequest.mergeCommit.oid,
      };
    });
  }

  getCommitUrl(commitSha: string, projectPath: string): string {
    return new URL(path.join(projectPath, 'commit', commitSha), this.config.serviceUrl).toString();
  }

  private validateRequestData(data: any): void {
    if (data.repository === null) {
      console.error(
        'Unable to retrieve data from your GitHub, please check that your GitHub token, projectPath and your serviceUrl are correct.',
      );
      process.exit(1);
    }

    if (data.repository.milestones.nodes.length === 0) {
      console.log('Unable to find your milestone');
      process.exit(1);
    }
  }
}

export = GitHubService;
