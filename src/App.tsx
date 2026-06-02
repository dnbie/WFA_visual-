import { Navigate, Route, Routes } from "react-router-dom";
import { TopNav } from "./components/layout/TopNav";
import { Footer } from "./components/layout/Footer";
import { UploadPage } from "./pages/UploadPage";
import { ConfigurePage } from "./pages/ConfigurePage";
import { DashboardPage } from "./pages/DashboardPage";
import { PromptExplorerPage } from "./pages/PromptExplorerPage";

function App() {
  return (
    <div className="min-h-screen bg-[--wfa-bg]">
      <TopNav />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/upload" replace />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/configure" element={<ConfigurePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/prompt-explorer" element={<PromptExplorerPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
