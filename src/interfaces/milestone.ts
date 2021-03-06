interface MergeRequest {
  title: string;
  labels: Array<string>;
  participants: Array<string>;
  commitSha?: string;
}

export = MergeRequest;
