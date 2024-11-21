import { ActionFunction, ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { Button, Card, List } from "flowbite-react";
import { HiCheckCircle } from "react-icons/hi";
import { GetReplacementRequestById, UpdateReplacementRequestStatus } from "../model/replacement-request";
import { GetReplacementProposalById, UpdateReplacementProposalStatus } from "../model/replacement-proposal";
import invariant from "tiny-invariant";
import queryString from "query-string";

export const loader = async ({
  request,
  params
}: LoaderFunctionArgs) => {
  invariant(params.proposalId, "Missing proposalId param");

  const url = new URL(request.url);
  const queryParams = queryString.parse(url.search);
  const approveKey = queryParams.approve_key;

  const replacementProposal = await GetReplacementProposalById(params.proposalId);
  const replacementRequest = await GetReplacementRequestById(replacementProposal?.data?.request_id);

  if (!replacementProposal) {
    throw new Response("Not found", { status: 404 });
  }

  return { replacementProposal, replacementRequest, approveKey };
};

export const meta: MetaFunction = () => {
  return [
    { title: "Cotización de repuesto" },
    { name: "description", content: "Detalles de cotización de repuesto!" },
  ];
};

export const approveProposal = async (proposalId: string, replacementId: string) => {
  console.log("Approving proposal", proposalId);
  console.log("Updating request status", replacementId);
  await UpdateReplacementRequestStatus(replacementId, "completed");
  await UpdateReplacementProposalStatus(proposalId, "approved");
  return null;
}

export default function ReplacementProposal() {
  const { replacementProposal, replacementRequest, approveKey } = useLoaderData<typeof loader>();
  const canApprove = replacementRequest?.data?.status !== "completed" && approveKey && replacementProposal.data?.approve_key === approveKey;
  console.log("replacementRequest", replacementRequest?.data?.status);

  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl
      dark:text-white">
        Cotización de repuesto
      </h1>

      <div className="overflow-x-auto">
        <div className="flex">
          <div className="w-1/3">
            <Card className="max-w-sm">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {replacementRequest?.data?.replacement.toUpperCase()}
              </h5>
              <div className="font-normal text-gray-700 dark:text-gray-400">
                {replacementRequest?.data?.transcription} <br /><br />
                <List>
                  <List.Item icon={HiCheckCircle}><b>Marca:</b>&nbsp; {replacementRequest?.data?.brand}</List.Item>
                  <List.Item icon={HiCheckCircle}><b>Modelo:</b>&nbsp; {replacementRequest?.data?.model}</List.Item>
                  <List.Item icon={HiCheckCircle}><b>Año:</b>&nbsp; { replacementRequest?.data?.year }</List.Item>
                  {replacementRequest?.data?.audio ? (
                    <List.Item icon={HiCheckCircle}>
                      <a href={replacementRequest?.data?.audio} target="_blank" rel="noreferrer noopener">Audio</a>
                    </List.Item>
                  ): ("")}
                </List>
              </div>

              {canApprove ? (
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  onClick={async () => await approveProposal(replacementProposal.id, replacementRequest?.id)}
                >
                  Aprobar
                </button>
              ) : null}
            </Card>
          </div>
          <div className="w-2/3">
            <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
              { new Date(replacementProposal.data?.created_at.seconds * 1000).toLocaleDateString("en-GB") }
            </h2>
            <div className="font-normal text-gray-700 dark:text-gray-400">
              {replacementProposal.data?.photo ? (
                <img src={replacementProposal.data?.photo} alt="Replacement part" />
              ): ("")}
              {replacementProposal.data?.description} <br /><br />
              <List>
                <List.Item icon={HiCheckCircle}><b>Precio:</b>&nbsp; $ {replacementProposal.data?.price}</List.Item>
              </List>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
