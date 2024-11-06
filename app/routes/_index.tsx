import type { MetaFunction } from "@remix-run/node";
import { Table } from "flowbite-react";
import { GetAllPendingRequests } from "../model/replacement-request";
import { useLoaderData } from "@remix-run/react";
import type { ReplacementRequestListType } from "../model/replacement-request";

export const meta: MetaFunction = () => {
  return [
    { title: "QuienTiene.com" },
    { name: "description", content: "Ingreso a la plataforma" },
  ];
};

export const loader = async () => {
  const requests = await GetAllPendingRequests();
  return requests;
}

export default function Index() {
  const pendingRequests = useLoaderData<ReplacementRequestListType[]>();

  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl
      dark:text-white">
        Solicitudes pendientes
      </h1>
      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Repuesto</Table.HeadCell>
            <Table.HeadCell>Marca</Table.HeadCell>
            <Table.HeadCell>Modelo</Table.HeadCell>
            <Table.HeadCell>Año</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Ver</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {pendingRequests.map((request, index) => (
              <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {request.data?.replacement}
                </Table.Cell>
                <Table.Cell>{request.data?.brand}</Table.Cell>
                <Table.Cell>{request.data?.model}</Table.Cell>
                <Table.Cell>{request.data?.year}</Table.Cell>
                <Table.Cell>
                  <a href={`/replacement-requests/${request.id}`} className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                    Ver
                  </a>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
