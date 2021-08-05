import GitService = require('./gitService');
import Config = require('./interfaces/config');
import ConfigSection = require('./interfaces/configSection');
import MergeRequest = require('./interfaces/milestone');

class ChangelogGenerator {
  #gitService: GitService;

  #milestone: string;

  #projectPath: string;

  #config: Config;

  #mergeRequests: Array<MergeRequest> = [];

  constructor(config: Config, gitService: GitService, milestone = '1.0.0', projectPath = '') {
    this.#config = config;
    this.#gitService = gitService;
    this.#milestone = milestone;
    this.#projectPath = projectPath;
  }

  async init() {
    this.#mergeRequests = await this.#gitService.getMergeRequests(this.#milestone, this.#projectPath);
  }

  async generate(): Promise<string> {
    let changelog = '';

    await this.init();

    changelog = changelog.concat(this.generateMergeRequestsContent(this.#mergeRequests, this.#config.sections));

    if (this.#config.enableContributorsSection) {
      changelog = changelog.concat(this.generateContributorsContent());
    }

    return changelog;
  }

  generateMergeRequestsContent(mergeRequests: Array<MergeRequest>, sections: Array<ConfigSection>): string {
    const mergeRequestSections = this.mapMergeRequestsToSection(mergeRequests, sections);

    let mergeRequestsContent = '';
    Object.keys(mergeRequestSections).forEach((section, index) => {
      if (index > 0) {
        mergeRequestsContent = mergeRequestsContent.concat('\n');
      }
      mergeRequestsContent = mergeRequestsContent.concat(`## ${section}\n\n`);

      mergeRequestSections[section].forEach((mergeRequestTitle) => {
        mergeRequestsContent = mergeRequestsContent.concat(`- ${mergeRequestTitle}`);

        mergeRequestsContent = mergeRequestsContent.concat(
          this.generateExternalIssuesSectionIfEnabled(mergeRequestTitle),
        );
        mergeRequestsContent = mergeRequestsContent.concat('\n');
      });
    });

    return mergeRequestsContent;
  }

  generateExternalIssuesSectionIfEnabled(mergeRequestTitle: string): string {
    if (this.#config.enableExternalIssuesTracker) {
      for (const youtrackProject of this.#config.externalIssuesProjects || []) {
        const issueTrackerRegexPattern = new RegExp(`(${youtrackProject}-([1-9][0-9]*))`, 'gm');
        const issueTrackerRegexResult = mergeRequestTitle.match(issueTrackerRegexPattern);
        if (issueTrackerRegexResult) {
          return `<br/>${this.#config.externalIssuesUrl}/${issueTrackerRegexResult[0]}`;
        }
      }
    }

    return '';
  }

  mapMergeRequestsToSection(
    mergeRequests: Array<MergeRequest>,
    sections: Array<ConfigSection>,
  ): { [key: string]: Array<string> } {
    const mergeRequestSections: { [key: string]: Array<string> } = {};

    sections.forEach((section) => {
      mergeRequestSections[section.title] = [];

      mergeRequests.forEach((mergeRequest) => {
        if (section.labels.some((label) => mergeRequest.labels.includes(label))) {
          let title = mergeRequest.title;

          if (this.#config.enableCommitSha) {
            title = title.concat(
              ` (${this.#gitService.getCommitUrl(mergeRequest.commitSha ?? '', this.#projectPath)})`,
            );
          }

          mergeRequestSections[section.title].push(title);
        }
      });
    });

    return mergeRequestSections;
  }

  generateContributorsContent(): string {
    let contributorContent = `\n## ${this.#config.contributorTitle}\n`;

    const contributorsSet = new Set<string>();
    const contributorsToExcludeSet = new Set(this.#config.contributorsToExclude);

    this.#mergeRequests.forEach((mergeRequest: MergeRequest) => {
      mergeRequest.participants.forEach((participant) => {
        contributorsSet.add(participant);
      });
    });

    const contributorsToIncludeSet = new Set(
      [...contributorsSet].filter((contributor: string) => !contributorsToExcludeSet.has(contributor)),
    );

    contributorsToIncludeSet.forEach((contributor) => {
      contributorContent = contributorContent.concat(`- ${contributor}\n`);
    });

    return contributorContent;
  }
}

export = ChangelogGenerator;
