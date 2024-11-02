import { Form, useActionData } from "@remix-run/react";
import { ActionFunction, redirect } from "@remix-run/node";
import { createStore } from "~/model/stores";
import bcrypt from "bcryptjs";
import { Button, Label, TextInput } from "flowbite-react";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    return { error: "Las contraseñas no coinciden." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await createStore({
    name,
    phone,
    email,
    password: hashedPassword,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return redirect("/stores");
};

interface ActionDataType {
  error?: string;
}

export default function NewStore() {
  const actionData = useActionData<ActionDataType>();

  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl
      dark:text-white">
        Registrar mi empresa
      </h1>

      <div className="overflow-x-auto">
        <Form method="post">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Nombre" />
            </div>
            <TextInput id="name" name="name" type="text" placeholder="Nombre de la tienda" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="phone" value="Teléfono" />
            </div>
            <TextInput id="phone" name="phone" type="text" placeholder="+5939********" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Correo electónico" />
            </div>
            <TextInput id="email" name="email" type="email" placeholder="mi-correo@correo.com" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Contraseña" />
            </div>
            <TextInput id="password" name="password" type="password" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="confirm-password" value="Confirmar contraseña" />
            </div>
            <TextInput id="confirm-password" name="confirmPassword" type="password" required />
          </div>
          {actionData?.error && <p>{actionData.error}</p>}
          <Button type="submit">Registrar</Button>
        </Form>
      </div>
    </div>
  );
}
