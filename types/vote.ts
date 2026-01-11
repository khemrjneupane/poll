import { CandidateDocument } from "@/backend/models/nominee";
import { Nominee } from "@/components/nominees/NomineesTable";

export interface Party {
  id: string;
  name: string;
  votes: number;
  color: string;
}

export interface VoteRecord {
  voterId: string;
  partyId: string;
  timestamp: Date;
}

export interface ElectionState {
  parties: Party[];
  votes: VoteRecord[];
  totalVotes: number;
}

// Define a strong response type for the IP fetching API
export interface GetIPResponse {
  success: boolean;
  fingerprint: string;
  youNominatedNominee?: {
    id: string;
    name: string;
    surname: string;
    party: string;
  } | null;
  youVotedNominee?: {
    id: string;
    name: string;
    surname: string;
    party: string;
  } | null;
  voter?: {
    userId: string;
    ipAddress: string;
  } | null;
  messageNominated?: string;
  messageVoted?: string;
  nominatedObject?: Nominee; // you can make this Nominee type if imported
  votedObject?: Nominee;
}
export interface VotedNominatedStatusProps {
  type?: "home" | "";
}
