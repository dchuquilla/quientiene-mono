import { GetDocumentsByField } from "./fb-initializer";

export const GetReplacementRequestHistoryByRequestId = async (id: string) => {
  console.log(`GetReplacementRequestHistoryByRequestId: ${id}`);
  return await GetDocumentsByField("request-history", "request_id", id);
};
