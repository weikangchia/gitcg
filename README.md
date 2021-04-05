# gitcg

## Getting Started

### GitLab

- Get a personal token (scopes: `read_api`)
- Store it as a environment variable
  ```export GITLAB_TOKEN=<your personal gitlab token>```

### Usage
```sh-session
$ npm install -g gitcg
$ gitcg COMMAND
running command...
$ gitcg --help [COMMAND]
USAGE
  $ gitcg COMMAND
...
```

## Configuration Options

By default **gitcg** reads all configurable options from `config.json` at the following location

```
Unix: ~/.config/gitcg
Windows: %LOCALAPPDATA%\gitcg
Can be overridden with XDG_CONFIG_HOME
```

 Below are the available configurable options.

- [service](#service)
- [serviceUrl](#serviceUrl)
- [sections](#sections)
  - [title](#title)
  - [labels](#labels)
- [enableContributorsSection](#enableContributorsSection)
- [contributorsToExclude](#contributorsToExclude)
- [contributorTitle](#contributorTitle)
- [enableExternalIssuesTracker](#enableExternalIssuesTracker)
- [externalIssuesUrl](#externalIssuesUrl)
- [externalIssuesProjects](#externalIssuesProjects)

### service

| Name        | Value           |
| ------------- |-------------|
| type      | string |
| mandatory | true |
| supportedValues | gitlab |


Example
```json
{
  "service": "gitlab"
}
```

### serviceUrl

| Name        | Value           |
| ------------- |-------------|
| type      | string |
| mandatory | true |

Example
```json
{
  "service": "gitlab",
  "serviceUrl": "https://gitlab.com"
}
```

### sections

| Name        | Value           |
| ------------- |-------------|
| type      | array |
| mandatory | false |

Example
```json
{
  "service": "gitlab",
  "serviceUrl": "https://gitlab.com",
  "sections": []
}
```

#### title

| Name        | Value           |
| ------------- |-------------|
| type      | string |
| parent    | sections |
| mandatory | true |

Example
```json
{
  "service": "gitlab",
  "serviceUrl": "https://gitlab.com",
  "sections": [
    {
      "title": ":star2: New Features",
      "labels": ["feature"]
    }
  ]
}
```

#### labels

| Name        | Value           |
| ------------- |-------------|
| type      | string |
| parent    | sections |
| mandatory | true |

Example
```json
{
  "service": "gitlab",
  "serviceUrl": "https://gitlab.com",
  "sections": [
    {
      "title": ":star2: New Features",
      "labels": ["feature"]
    }
  ]
}
```

### enableContributorsSection

| Name        | Value           |
| ------------- |-------------|
| type      | boolean |
| mandatory | false |

Example
```json
{
  "service": "gitlab",
  "serviceUrl": "https://gitlab.com",
  "enableContributorsSection": true,
  "contributorTitle": ":heart: Contributors\nWe'd like to thank all the contributors who worked on this sprint!"
}
```

### contributorsToExclude

| Name        | Value           |
| ------------- |-------------|
| type      | array |
| mandatory | false |

Example
```json
{
  "service": "gitlab",
  "serviceUrl": "https://gitlab.com",
  "enableContributorsSection": true,
  "contributorsToExclude": ["user1", "user2"],
}
```

### contributorTitle

| Name        | Value           |
| ------------- |-------------|
| type      | string |
| mandatory | false |

Example
```json
{
  "service": "gitlab",
  "serviceUrl": "https://gitlab.com",
  "enableContributorsSection": true,
  "contributorTitle": ":heart: Contributors\nWe'd like to thank all the contributors who worked on this sprint!"
}
```

### enableExternalIssuesTracker

| Name        | Value           |
| ------------- |-------------|
| type      | array |
| mandatory | false |

Example
```json
{
  "service": "gitlab",
  "serviceUrl": "https://gitlab.com",
  "enableExternalIssuesTracker": true
}
```

### externalIssuesUrl

| Name        | Value           |
| ------------- |-------------|
| type      | string |
| mandatory | false |

Example
```json
{
  "service": "gitlab",
  "serviceUrl": "https://gitlab.com",
  "enableExternalIssuesTracker": true,
  "externalIssuesUrl": "https://youtrack.com/issue",
}
```

### externalIssuesProjects

| Name        | Value           |
| ------------- |-------------|
| type      | array |
| mandatory | false |

Example
```json
{
  "service": "gitlab",
  "serviceUrl": "https://gitlab.com",
  "enableExternalIssuesTracker": true,
  "externalIssuesUrl": "https://youtrack.com/issue",
  "externalIssuesProjects": ["PROJ1", "PROJ2"],
}
```
