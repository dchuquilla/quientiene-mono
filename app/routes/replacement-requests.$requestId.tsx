import { type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Badge, Button, Card, List, Timeline } from "flowbite-react";
import { HiCheckCircle, HiCalendar } from "react-icons/hi";
import { GetReplacementRequestById, replacementStatusOptions } from "../model/replacement-request";
import { GetReplacementRequestHistoryByRequestId } from "../model/replacement-request-history";
import invariant from "tiny-invariant";
import { authenticator } from "~/services/auth.server";
import { GetDocumentsByField } from "~/model/fb-initializer";
import queryString from "query-string";


export const loader = async ({
  params, request }: LoaderFunctionArgs) => {
  invariant(params.requestId, "Missing requestId param");

  const user = await authenticator.isAuthenticated(request);
  const url = new URL(request.url);
  const queryParams = queryString.parse(url.search);
  const detailsKey = queryParams.detailsKey;

  const creator = user?.email ? (await GetDocumentsByField("users", "email", user.email)) : null;
  const store = creator && creator[0]?.id ? (await GetDocumentsByField("stores", "user_id", creator[0].id)) : null
  const replacementRequest = await GetReplacementRequestById(params.requestId);
  const replacementRequestHistory = await GetReplacementRequestHistoryByRequestId(params.requestId)

  console.log("replacementRequestHistory 1:", replacementRequestHistory);

  if (!replacementRequest?.data) {
    throw new Response("Not found", { status: 404 });
  }

  return { replacementRequest, replacementRequestHistory, user, store, detailsKey };
};


export const meta: MetaFunction = () => {
  return [
    { title: "Solicitud de repuesto" },
    { name: "description", content: "Detalles de solicitud de repuesto!" },
  ];
};

export default function ReplacementRequests() {
  const { replacementRequest, replacementRequestHistory, user, store, detailsKey } = useLoaderData<typeof loader>();
  console.log("detailsKey 1:", detailsKey);
  console.log("detailsKey 2:", replacementRequest.data?.details_key);

  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl
      dark:text-white">
        Solicitud de repuesto
      </h1>

      <div className="overflow-x-auto">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3">
            <Card className="max-w-sm">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {replacementRequest.data?.replacement.toUpperCase()}
              </h5>

              <Badge color={replacementStatusOptions[replacementRequest.data?.status]?.badge}>{ replacementStatusOptions[replacementRequest.data?.status]?.label }</Badge>
              <div className="font-normal text-gray-700 dark:text-gray-400">
                {replacementRequest.data?.transcription} <br /><br />
                <List>
                  <List.Item icon={HiCheckCircle}><b>Marca:</b>&nbsp; {replacementRequest.data?.brand}</List.Item>
                  <List.Item icon={HiCheckCircle}><b>Modelo:</b>&nbsp; {replacementRequest.data?.model}</List.Item>
                  <List.Item icon={HiCheckCircle}><b>Año:</b>&nbsp; { replacementRequest.data?.year }</List.Item>
                  {replacementRequest.data?.audio ? (
                    <List.Item icon={HiCheckCircle}>
                      <a href={replacementRequest.data?.audio} target="_blank" rel="noreferrer noopener">Audio 🎧</a>
                    </List.Item>
                  ): ("")}
                </List>
              </div>
              {user && replacementRequest.data?.status !== 'completed' ? (
                <Button as={Link} href={`/quotes/${replacementRequest.id}/new`} to={`/quotes/${replacementRequest.id}/new`}>
                  Cotizar
                  <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              ) : null}
            </Card>
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">Historial</h2>
            <div className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
              <Timeline>
                <Timeline.Item>
              <Timeline.Point icon={HiCalendar} />
              <Timeline.Content>
                <Timeline.Time>{new Date(replacementRequest.data?.created_at.seconds * 1000).toLocaleDateString("en-GB")}</Timeline.Time>
                <Timeline.Title>{ replacementStatusOptions["new"]?.label }</Timeline.Title>
              </Timeline.Content>
                </Timeline.Item>
                {replacementRequestHistory?.map((history, index) => (
                  <Timeline.Item key={index}>
                    <Timeline.Point icon={HiCalendar} />
                    <Timeline.Content>
                      <Timeline.Time>{ new Date(history?.data?.created_at?.seconds * 1000).toLocaleDateString("en-GB") }</Timeline.Time>
                      <Timeline.Title>{replacementStatusOptions[history?.data?.type]?.label} | { history.store?.name }</Timeline.Title>
                      {detailsKey === replacementRequest.data?.details_key || (user && store && store[0]?.id === history?.store?.id) ? (
                        <Button color="success" as={Link} href={`/replacement-proposals/${history.data?.proposal_id}`} to={`/replacement-proposals/${history.data?.proposal_id}`}>
                          Ver detalles
                        </Button>
                      ) : null}
                    </Timeline.Content>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
