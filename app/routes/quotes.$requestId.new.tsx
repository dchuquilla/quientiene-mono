import { type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, List } from "flowbite-react";
import { HiCheckCircle } from "react-icons/hi";
import { GetReplacementRequestById } from "../model/replacement-request";
import invariant from "tiny-invariant";


export const loader = async ({
  params }: LoaderFunctionArgs) => {
  invariant(params.requestId, "Missing requestId param");

  const replacementRequest = await GetReplacementRequestById(params.requestId);

  if (!replacementRequest) {
    throw new Response("Not found", { status: 404 });
  }

  return { replacementRequest };
};

export const meta: MetaFunction = () => {
  return [
    { title: "Solicitud de repuesto" },
    { name: "description", content: "Detalles de solicitud de repuesto!" },
  ];
};

export default function CreateQuote() {
  const { replacementRequest } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl
      dark:text-white">
        Cotizar repuesto
      </h1>


      <div className="overflow-x-auto">
        <div className="flex">
          <div className="w-full w-1/3">
            <Card href="#" className="max-w-sm">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {replacementRequest.data?.replacement.toUpperCase()}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
          {replacementRequest.data?.transcription} <br /><br />
          <List>
            <List.Item icon={HiCheckCircle}><b>Marca:</b>&nbsp; {replacementRequest.data?.brand}</List.Item>
            <List.Item icon={HiCheckCircle}><b>Modelo:</b>&nbsp; {replacementRequest.data?.model}</List.Item>
            <List.Item icon={HiCheckCircle}><b>Año:</b>&nbsp; { replacementRequest.data?.year }</List.Item>
            {replacementRequest.data?.audio ? (
              <List.Item icon={HiCheckCircle}>
          <a href={replacementRequest.data?.audio} target="_blank" rel="noreferrer noopener">Audio</a>
              </List.Item>
            ): ("")}
          </List>
              </p>
            </Card>
          </div>
          <div className="w-full w-2/3">
            <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">Crear cotizacion</h2>
            <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">

            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
