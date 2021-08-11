import Url = require('url');
import Path = require('path');

import GitService = require('../gitService');
import Config = require('../interfaces/config');
import MergeRequest = require('../interfaces/milestone');

import { gql, GraphQLClient } from 'graphql-request';

class GitLabService extends GitService {
  #client: GraphQLClient;

  constructor(config: Config) {
    super(config);

    this.#client = new GraphQLClient(`${this.config.serviceUrl}/api/graphql`, {
      headers: {
        authorization: `Bearer ${process.env.GITLAB_TOKEN}`,
      },
    });
  }

  async getMergeRequests(milestone: string, projectPath: string): Promise<Array<MergeRequest>> {
    const query = gql`
      {
        project(fullPath: "${projectPath}") {
          mergeRequests(milestoneTitle: "${milestone}", sort: MERGED_AT_ASC, state: merged) {
            nodes {
              title,
              participants(first: 10) {
                nodes {
                  username
                }
              }
              labels(first: 10) {
                nodes {
                  title
                }
              }
              mergeCommitSha
            }
          }
        }
      }
    `;

    const data = await this.#client.request(query);

    if (data.project === null) {
      console.error(
        'Unable to retrieve data from your GitLab, please check that your GitLab token, projectPath and your serviceUrl are correct.',
      );
      process.exit(1);
    }

    return data.project.mergeRequests.nodes.map((mergeRequest: any) => {
      const labels = mergeRequest.labels.nodes.map((label: any) => label.title);
      const participants = mergeRequest.participants.nodes.map((participant: any) => participant.username);

      return {
        title: mergeRequest.title,
        labels,
        participants,
        commitSha: mergeRequest.mergeCommitSha,
      };
    });
  }

  getCommitUrl(commitSha: string, projectPath: string): string {
    const commitUrl = new Url.URL(this.config.serviceUrl);
    commitUrl.pathname = Path.join(projectPath, '-', 'commit', commitSha);

    return commitUrl.toString();
  }
}

export = GitLabService;
