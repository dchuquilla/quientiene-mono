"use client";

import { json, replace, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Table } from "flowbite-react";
import invariant from "tiny-invariant";

export const loader = async ({
  params }: LoaderFunctionArgs) => {
  invariant(params.requestId, "Missing requestId param");
  const replacementRequests = [{"id": 1}, {"id": 2}, {"id": 3}];

  if (!replacementRequests) {
    throw new Response("Not found", { status: 404 });
  }

  return { replacementRequests };
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const { replacementRequests } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl
      dark:text-white">
        Mis solicitudes
      </h1>

      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Product name</Table.HeadCell>
            <Table.HeadCell>Color</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {
            replacementRequests.length ? (
              replacementRequests.map((replacementRequest) => (
                <Table.Row key={replacementRequest.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {'Apple MacBook Pro 17"'}
                  </Table.Cell>
                  <Table.Cell>Sliver</Table.Cell>
                  <Table.Cell>Laptop</Table.Cell>
                  <Table.Cell>$2999</Table.Cell>
                  <Table.Cell>
                    <a href={`/${replacementRequest.id}/edit`} className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                      Edit
                    </a>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" colSpan={5}>
                  Noting found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
