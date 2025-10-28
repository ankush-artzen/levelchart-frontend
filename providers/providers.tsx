"use client";

import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import ApolloProvider from "./ApolloProvider";
import Link from "next/link";
import AppBridgeProvider from "@/app/components/AppBridgeProvider";
import SessionProvider from "./SessionProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider i18n={translations}>
      <ApolloProvider>
        <AppBridgeProvider>
          <ui-nav-menu>
            <Link href="/setting">Setting</Link>
            <Link href="/help">Help</Link>
          </ui-nav-menu>
          {/* <SessionProvider> */}
            {children}
            {/* </SessionProvider> */}
        </AppBridgeProvider>
      </ApolloProvider>
    </AppProvider>
  );
}

export function ExitProvider({ children }: { children: React.ReactNode }) {
  return <AppProvider i18n={translations}>{children}</AppProvider>;
}
