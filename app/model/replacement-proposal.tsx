import { GetDocumentById, SaveDocument } from "./fb-initializer";

export const GetReplacementProposalById = async (id: string) => {
  return await GetDocumentById("replacement-proposals", id);
};

export const SaveReplacementProposal = async (data: object) => {
  return await SaveDocument("replacement-proposals", data);
}
