export enum ISSUE_TYPE {
  ALL = 'all',
  SUBMITTED = 'submitted',
  PENDING = 'pending',
}

export type ISSUE_TYPET =
  | ISSUE_TYPE.ALL
  | ISSUE_TYPE.SUBMITTED
  | ISSUE_TYPE.PENDING;
