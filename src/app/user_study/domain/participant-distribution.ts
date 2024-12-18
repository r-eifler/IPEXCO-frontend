export interface UserStudySelection {
  userStudy?: string;
  numberParticipants?: number;
}

export interface ParticipantDistribution {
  _id?: string;
  user?: string;
  name: string;
  description: string;
  userStudies: UserStudySelection[];
}
