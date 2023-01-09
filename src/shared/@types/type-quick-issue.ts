export interface IssueQueryData {
  page: number;
  per_page: number;
  search: string;
  issue_type: string;
  priority: string;
  direction: string;
  create: string;
  author: string;
  exclusion: Array<string> | string;
  assignee: string;
  label: Array<string> | string;
  branch: string;
  repo: string;
  issue_state: Array<string> | string;
  milestone: Array<string> | string;
}

export interface OptionList {
  page: number;
  keyword: string;
  data: any[];
  total?: number;
}
export interface IssueData {
  title: string;
  issue_type_id: string | number | undefined;
  sig: string;
  project_id: number;
  repo: string;
  email: string;
  code: string;
  description: string;
  privacy: Array<string>;
}
