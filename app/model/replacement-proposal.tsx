import { GetDocumentById, SaveDocument, SaveRequestHistory } from "./fb-initializer";

export const GetReplacementProposalById = async (id: string) => {
  return await GetDocumentById("replacement-proposals", id);
};

export const SaveReplacementProposal = async (data: object) => {
  const proposal_id = await SaveDocument("replacement-proposals", data);
  return await SaveRequestHistory({ "type": "replacement-proposal", "proposal_id": proposal_id });
}
