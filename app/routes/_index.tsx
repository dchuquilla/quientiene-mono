import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Table } from "flowbite-react";
import { GetAllPendingRequests, SearchPendingRequests } from "../model/replacement-request";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import type { ReplacementRequestListType } from "../model/replacement-request";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "QuienTiene.com" },
    { name: "description", content: "Ingreso a la plataforma" },
  ];
};

export const loader = async ({
    request
  }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const pendingRequests = q ? await SearchPendingRequests(q) :await GetAllPendingRequests();
  return {pendingRequests, q};
}

export default function Index() {
  const { pendingRequests, q } = useLoaderData<{ pendingRequests: ReplacementRequestListType[], q: string | null }>();
  const navigation = useNavigation();
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    const searchField = document.getElementById("search-form");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  });

  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl
      dark:text-white">
        Solicitudes pendientes
      </h1>
      <div className="overflow-x-auto">
        <Form id="search-form" role="search" className="pb-4 bg-white dark:bg-gray-900">
          <div className="relative mt-1">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              type="search"
              id="search-form"
              name="q"
              defaultValue={q || ""}
              aria-label="Buscar solicitudes"
              className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={`${searching ? "Buscando" : "Buscar en las solicitudes"}`} />
          </div>
        </Form>
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
