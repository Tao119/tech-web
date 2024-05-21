import "@/styles/style.scss";
import SessionProvider from "./sessionProvider";
import { OverLay } from "@/components/overlay";
import { ContextProvider } from "./contextProvider";
export const metadata = {
  title: "lit-group",
  description: "lit-group",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="en">
        <head>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/destyle.css@1.0.15/destyle.css"
          />
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body>
          <div className="l-main">
            <ContextProvider>{children} </ContextProvider>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
