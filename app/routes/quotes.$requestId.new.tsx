import { type LoaderFunctionArgs, type MetaFunction, type ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, List, Button, FileInput, Label, Textarea, TextInput } from "flowbite-react";
import { HiCheckCircle } from "react-icons/hi";
import { GetReplacementRequestById } from "../model/replacement-request";
import { type ReplacementProposalType, SaveReplacementProposal } from "../model/replacement-proposal";
import invariant from "tiny-invariant";
import fs from "fs/promises";
import path from "path";

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
    { title: "Cotizar repuesto" },
    { name: "description", content: "Cotizar una solicitud de repuesto!" },
  ];
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.requestId, "Missing requestId param");

  const formData = await request.formData();
  const description = formData.get("description");
  const price = formData.get("price");
  const photo = formData.get("photo");

  if (
    typeof description !== "string" ||
    typeof price !== "string"
  ) {
    return new Response("Invalid form data", { status: 400 });
  }
  let photoUri = "";

  if (photo) {
    // Save photo to public/images folder
    const photoBuffer = Buffer.from(await photo.arrayBuffer());

    // Generate a random 10-character string for photoName
    const generateRandomString = (length: number) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    };

    const extension = path.extname(photo.name);
    const photoName = `${generateRandomString(10)}${extension}`;

    const photoPath = path.join(process.cwd(), "public", "images", photoName);

    await fs.writeFile(photoPath, photoBuffer);

    photoUri = `/images/${photoName}`;
  }

  const data: ReplacementProposalType = {
    request_id: params.requestId,
    description,
    price: parseFloat(price),
    photo: photoUri,
    status: "pending",
  };

  await SaveReplacementProposal(data);

  return redirect(`/replacement-requests/${params.requestId}`);
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
          <div className="w-1/3">
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
          <div className="w-2/3">
            <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">Crear cotización</h2>
            <form method="post" encType="multipart/form-data" className="flex flex-col">
              <div className="mb-5">
                <Label htmlFor="description" value="Descripción del repuesto" />
                <Textarea id="description" name="description" required />
              </div>
                <div className="mb-5">
                <Label htmlFor="price" value="Precio" />
                <TextInput
                  id="price"
                  name="price"
                  type="text"
                  pattern="^\d+(\,\d{1,2})?$"
                  title="Please enter a valid price (e.g., 1234,56)"
                  required
                />
                </div>
              <div className="mb-10">
                <Label htmlFor="photo" value="Fotografía" />
                <FileInput id="photo" name="photo" accept="image/*" required />
              </div>
              <Button type="submit">Enviar</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
