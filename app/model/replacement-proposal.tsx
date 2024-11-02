import { GetDocumentById, SaveDocument, SaveRequestHistory } from "./fb-initializer";
import { UpdateReplacementRequestStatus } from "./replacement-request";

export interface ReplacementProposalType {
  description?: string;
  price?: number;
  photo?: string;
  request_id?: string;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
  completed_at?: Date;
}

export const GetReplacementProposalById = async (id: string) => {
  return await GetDocumentById("replacement-proposals", id);
};

export const SaveReplacementProposal = async (data: ReplacementProposalType) => {
  data = { ...data, "created_at": new Date(), "updated_at": new Date() };
  const proposal_id = await SaveDocument("replacement-proposals", data);
  if (data.request_id) {
    UpdateReplacementRequestStatus(data.request_id, "in-progress");
  }
  const historyData = {
    "type": "new-proposal",
    "proposal_id": proposal_id,
    "request_id": data.request_id
  }
  return await SaveRequestHistory(historyData);
}
