export interface CreateChallengeDTO {
  id: string;
  title: string;
  category: string;
  deadline: Date;
  duration: string;
  moneyPrize: number;
  status: string;
  skills: string[];
  seniority: string[];
  projectDescription: string;
  projectBrief: string;
  projectTask: string;
  participantsIDs?: string[];
}

export interface ChallengeResponseDTO {
  id: string;
  title: string;
  category: string;
  deadline: Date;
  duration: string;
  moneyPrize: number;
  projectDescription: string;
  projectBrief: string;
  projectTask: string;
  participantsIDs?: string[];
  participants: string;
  status: string;
  skills: string[];
  seniority: string[];
}
