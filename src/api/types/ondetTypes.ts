export type OndetData = {
  markdown: MongoDBDocument;
  difference: Difference;
  gitDiff: string;
  gitDiffUrl?: string;
  status?: DiffAvailabilitySummary;
};

export type DiffAvailabilitySummary = {
  robot?: DiffAvailability;
  conto?: DiffAvailability;
  git?: DiffAvailability;
};

export type DiffAvailability = {
  status?: "AVAILABLE" | "EXTERNAL_URL" | "NOT_APPLICABLE" | "NOT_AVAILABLE";
  message?: string;
  url?: string;
  sizeBytes?: number;
  inlineRecommended?: boolean;
};

export type ProcessedDiffTimelineItem = {
  uri?: string;
  sha: string;
  parentSha?: string;
  date?: string;
  parentDate?: string;
  message?: string;
  robotStatus?: string;
  robotErrorCode?: string;
  gitDiffAvailable?: boolean;
};

type MongoDBDocument = {
  file?: string;
  error?: string;
};

type Difference = {
  changes: Array<string>;
  error?: string;
};
