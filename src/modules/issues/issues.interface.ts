export type IssueType = "bug" | "feature_request";
export type IssueStatus = "open" | "in_progress" | "resolved";

export interface ICreateIssuePayload {
  title: string; // max 150 chars (enforced at DB level)
  description: string; // min 20 chars (enforced at DB level)
  type: IssueType;
  status?: IssueStatus; // optional, defaults to 'open'
  reporter_id: number;
}

export interface IIssue {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  reporter_id: number;
  created_at: string;
  updated_at: string;
}
