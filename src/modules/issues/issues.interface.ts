export type IssueType = "bug" | "feature_request";
export type IssueStatus = "open" | "in_progress" | "resolved";

export interface ICreateIssuePayload {
  title: string;
  description: string;
  type: IssueType;
  status?: IssueStatus;
  reporter_id: number;
}

export interface IUpdateIssuePayload {
  title?: string;
  description?: string;
  type?: IssueType;
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
