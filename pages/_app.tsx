import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { mainFont, secondaryFont, monoFont } from "@/public/fonts";
import { AppProvider } from "@/context/AppContext";
import { UmamiProvider } from "@/context/UmamiProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <UmamiProvider>
        <div className={`${mainFont.variable} ${secondaryFont.variable} ${monoFont.variable}`}>
          <Component {...pageProps} />
        </div>
      </UmamiProvider>
    </AppProvider>
  );
}
