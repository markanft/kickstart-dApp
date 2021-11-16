// _app.tsx
import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.css";
import { AppProps } from "next/app";
import { useState } from "react";
import Layout from "../components/Layout";
import { Provider } from "react-redux";
import { store } from "@store/store";

declare global {
  interface Window {
    ethereum: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const [account, setAccount] = useState<String | null>(null);

  return (
    <Provider store={store}>
      <Layout>
        <div className="mx-auto px-4 sm:px-6 md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
          <Component {...pageProps} />
        </div>
      </Layout>
    </Provider>
  );
}
export default MyApp;
