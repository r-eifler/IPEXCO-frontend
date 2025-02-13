export interface UserStudySelection {
  userStudy: string;
  numberParticipants: number;
}

export interface ParticipantDistributionBase {
  name: string;
  description: string;
  userStudies: UserStudySelection[];
}

export interface ParticipantDistribution extends ParticipantDistributionBase{
  _id: string;
  user: string;
}
