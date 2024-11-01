import { GetDocumentById, SaveDocument, SaveRequestHistory } from "./fb-initializer";

export interface ReplacementProposalType {
    description: string;
    price: number;
    photo: string;
    request_id: string;
  }

export const GetReplacementProposalById = async (id: string) => {
  return await GetDocumentById("replacement-proposals", id);
};

export const SaveReplacementProposal = async (data: ReplacementProposalType) => {
  const proposal_id = await SaveDocument("replacement-proposals", data);
  const historyData = {
    "type": "new-proposal",
    "proposal_id": proposal_id,
    "request_id": data.request_id
  }
  return await SaveRequestHistory(historyData);
}
