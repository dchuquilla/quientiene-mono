import { GetDocumentById } from "./fb-initializer";

export const GetReplacementProposalById = async (id: string) => {
  return await GetDocumentById("replacement-proposals", id);
};
