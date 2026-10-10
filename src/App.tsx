import TreeCanvas from "./components/TreeCanvas";
import DetailPanel from "./components/DetailPanel";
import Simulator from "./components/Simulator";
import {
  Header,
  Premessa,
  Regole,
  Partners,
  Flows,
  Results,
  Dashboard,
  NextSteps,
  Footer,
} from "./components/Sections";
import { useRevealGlobal } from "./hooks/useRevealGlobal";

export default function App() {
  useRevealGlobal();

  return (
    <main className="min-h-screen bg-moss-950 text-ink">
      <Header />
      <TreeCanvas />
      <Premessa />
      <Partners />
      <Flows />
      <Regole />
      <Simulator />
      <Results />
      <Dashboard />
      <NextSteps />
      <Footer />
      <DetailPanel />
    </main>
  );
}
