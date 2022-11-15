export interface FeatureInfo {
  featureName: string;
  sigs: string[];
}

export interface GroupInfo {
  groupName: string;
  features: FeatureInfo[];
}
