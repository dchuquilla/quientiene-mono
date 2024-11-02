import { type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, List } from "flowbite-react";
import { HiCheckCircle } from "react-icons/hi";
import { GetReplacementRequestById} from "../model/replacement-request";
import { GetReplacementProposalById } from "../model/replacement-proposal";
import invariant from "tiny-invariant";


export const loader = async ({
  params }: LoaderFunctionArgs) => {
  invariant(params.proposalId, "Missing proposalId param");

  const replacementProposal = await GetReplacementProposalById(params.proposalId);
  const replacementRequest = await GetReplacementRequestById(replacementProposal?.data?.request_id);

  if (!replacementProposal) {
    throw new Response("Not found", { status: 404 });
  }

  return { replacementProposal, replacementRequest };
};

export const meta: MetaFunction = () => {
  return [
    { title: "Cotización de repuesto" },
    { name: "description", content: "Detalles de cotización de repuesto!" },
  ];
};

export default function ReplacementProposal() {
  const { replacementProposal, replacementRequest } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl
      dark:text-white">
        Cotización de repuesto
      </h1>

      <div className="overflow-x-auto">
        <div className="flex">
          <div className="w-1/3">
            <Card href="#" className="max-w-sm">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {replacementRequest?.data?.replacement.toUpperCase()}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
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
              </p>
            </Card>
          </div>
          <div className="w-2/3">
            <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
              { new Date(replacementProposal.data?.created_at.seconds * 1000).toLocaleDateString("en-GB") }
            </h2>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {replacementProposal.data?.photo ? (
                <img src={replacementProposal.data?.photo} alt="Replacement part" />
              ): ("")}
              {replacementProposal.data?.description} <br /><br />
              <List>
                <List.Item icon={HiCheckCircle}><b>Precio:</b>&nbsp; $ {replacementProposal.data?.price}</List.Item>
              </List>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

}
