import { ColorModeProvider, ColorModeScript } from "@kobalte/core";
import { MetaProvider } from "@solidjs/meta";
import { Suspense } from "solid-js";
import { Router } from "@solidjs/router";
import Summary from "./pages/Summary";

const route = {
  path: "/",
  component: Summary
}

const App = () => {
  return (
    <MetaProvider>
      <Suspense>
        <ColorModeScript />
        <ColorModeProvider>
          <Router>
            {route}
          </Router>
        </ColorModeProvider>
      </Suspense>
    </MetaProvider>
  )
}

export default App