import AppProvider from "./src/AppProvider";
import Route from "./src/Route";

export default function App() {
  return (
    <>
      <AppProvider>
        <Route />
      </AppProvider>
    </>
  );
}
