
import { useEffect, useState } from "react";
import "./App.css";

const agentPool = [
  { name: "WitByte", image: "/agent1.png" },
  { name: "Goldmind", image: "/agent2.png" },
  { name: "Stealtha", image: "/agent3.png" },
  { name: "ByteBlaze", image: "/agent4.png" }
];

function shuffleAgents() {
  const doubled = [...agentPool, ...agentPool];
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }
  return doubled;
}

export default function App() {
  const [agents, setAgents] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    setAgents(shuffleAgents());
  }, []);

  useEffect(() => {
    if (matched.length === 8) {
      setHasWon(true);
    }
  }, [matched]);

  const handleFlip = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (agents[first].name === agents[second].name) {
        setMatched((prev) => [...prev, first, second]);
      }
      setTimeout(() => setFlipped([]), 800);
    }
  };

  return (
    <div className="game">
      <h1 className="title">Vooi Agent Flip</h1>
      {hasWon && <h2 className="win-message">🎉 All Agents Matched!</h2>}
      <div className="grid">
        {agents.map((agent, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <div
              key={index}
              className={`card ${isFlipped ? "flipped" : ""}`}
              onClick={() => handleFlip(index)}
            >
              <div className="front"></div>
              <div className="back">
                <img src={agent.image} alt={agent.name} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
