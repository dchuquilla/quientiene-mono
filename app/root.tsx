import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { Navbar } from "flowbite-react";
import { authenticator } from "~/services/auth.server";
import { UserType } from "~/model/stores"


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader = async ({
    request
  }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  return user;
};

export function Layout({ children }: { children: React.ReactNode }) {
  const user = useLoaderData<UserType>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="container mx-auto">
          <div className="flex flex-row flex-wrap py-4">
            <main role="main" className="w-full">
              <Navbar fluid={true} rounded={true}>
                <Navbar.Brand href="/">
                  <img
                    src="/qt_logos/quien_tiene_logo.svg"
                    className="mr-3 h-6 sm:h-9"
                    alt="QuienTiene Logo"
                  />
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                  <Navbar.Link href="/navbars">Nosotros</Navbar.Link>
                  <Navbar.Link href="/about">Precios</Navbar.Link>
                  {user ? (
                    <>
                      <Navbar.Link href="/navbars" active={true}>
                        Mis Solicitudes
                      </Navbar.Link>
                      <Navbar.Link href="/logout">Salir</Navbar.Link>
                    </>
                  ) : (
                    <Navbar.Link href="/login">Ingresar</Navbar.Link>
                  )}
                </Navbar.Collapse>
              </Navbar>
              <div className="bg-white px-2 py-2.5 dark:border-gray-700 dark:bg-gray-800 sm:px-4 rounded">
                {children}
              </div>
            </main>
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
export default function App() {
  return (
    <Outlet />
  );
}
