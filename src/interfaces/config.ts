import configSection = require('./configSection');

interface Config {
  service: string;
  serviceUrl: string;
  sections: Array<configSection>;
  contributorTitle: string;
  enableContributorsSection: boolean;
  contributorsToExclude: Array<string>;
  externalIssuesUrl: string;
  externalIssuesProjects: Array<string>;
  enableExternalIssuesTracker: boolean;
}

export = Config;
