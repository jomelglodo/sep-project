import { useEffect } from "react";
import MainLayout from "./pages/MainLayout";

function App() {
  useEffect(() => {
    document.title = "Semitec Program";
  }, []);
  return <MainLayout />;
}

export default App;
