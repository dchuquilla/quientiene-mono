import { GetDocumentsByField } from "./fb-initializer";
import { GetReplacementProposalById } from "./replacement-proposal";
import { GetStoreById } from "./stores";

export interface ReplacementRequestHistoryType {
  request_id?: string;
  proposal_id?: string;
  type?: string;
  created_at?: Date;
  updated_at?: Date;
  id?: string;
  data?: object;
}


export const GetReplacementRequestHistoryByRequestId = async (id: string) => {
  console.log(`GetReplacementRequestHistoryByRequestId: ${id}`);
  const history_items = await GetDocumentsByField("request-history", "request_id", id);
  if (!history_items) {
    return [];
  }
  return Promise.all(history_items.map(async (item: { id: string, data: ReplacementRequestHistoryType }) => {
    const proposal_id: string = item.data.proposal_id || '';
    const replacementProposal = await GetReplacementProposalById(proposal_id);
    const store = await GetStoreById(replacementProposal?.data?.store_id);
    return {id: item.id, data: item.data, proposal: replacementProposal?.data, store: {...store?.data, id: store?.id}};
  }));
};
