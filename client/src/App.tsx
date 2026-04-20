import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { HomePage } from "./pages/home";
import { ShowsPage } from "./pages/shows";
import { JournalPage } from "./pages/journal";
import { ReviewPage } from "./pages/review";
import NotFound from "./pages/not-found";
import { BottomNav } from "./components/BottomNav";

export function App() {
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        navigate("/");
        break;
      case "shows":
        navigate("/shows");
        break;
      case "journal":
        navigate("/journal");
        break;
      case "review":
        navigate("/review");
        break;
    }
  };

  const handleNavigate = (tab: string, showId?: number, action?: string, filter?: string) => {
    handleTabChange(tab);
    if (tab === "shows") {
      const params = new URLSearchParams();
      if (showId !== undefined) params.set("id", String(showId));
      if (action) params.set("action", action);
      if (filter) params.set("filter", filter);
      const qs = params.toString();
      navigate(`/shows${qs ? `?${qs}` : ""}`);
    }
  };

  return (
    <div className="min-h-screen bg-macaron-vanilla">
      <Routes>
        <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
        <Route path="/shows" element={<ShowsPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
