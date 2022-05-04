import { ThemeProvider, CSSReset, ColorModeProvider } from "@chakra-ui/core";
import theme from "../theme";
import Cookies from "universal-cookie";
import "./_app.css";

// initialColorMode added as prop to override default light mode - see below

function App({ Component, pageProps, initialColorMode }: any) {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider value={initialColorMode}>
        <CSSReset />
        <Component {...pageProps} />
      </ColorModeProvider>
    </ThemeProvider>
  );
}

// getInitialProps retrieves user prefered mode from cookie set by darkmode toggle
// Chakra UI stores user preference in localstorage which is not accessible for SSR and results in hydration mismatch

App.getInitialProps = async ({ Component, ctx }: any) => {
  // let pageProps = {};
  if (Component.getInitialProps) {
    // pageProps = await Component.getInitialProps(ctx);
  }
  const cookies = new Cookies(ctx.req?.headers.cookie);
  const isDarkMode = cookies.get("isDarkMode");
  return {
    pageProps: {
      defaultColor: "purple",
    },
    initialColorMode: isDarkMode === "true" ? "dark" : "light",
  };
};

export default App;
