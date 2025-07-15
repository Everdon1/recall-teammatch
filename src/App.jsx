import { useEffect, useState } from "react";
import { FaTwitter, FaVolumeMute, FaVolumeUp, FaMoon, FaSun } from "react-icons/fa";
import "./App.css";

const agentPool = [
  { name: "@andrewxhill", image: "/agent1.png" },
  { name: "#carsonfarmer", image: "/agent2.png" },
  { name: "@dataliquidity", image: "/agent3.png" },
  { name: "@dazuck", image: "/agent4.png" },
  { name: "@hey_kso", image: "/agent5.png" },
  { name: "@MsEggmily", image: "/agent6.png" },
  { name: "@TheDerrek", image: "/agent7.png" }
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
  const [muted, setMuted] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const clickSound = new Audio("/click.mp3");
  const matchSound = new Audio("/match.mp3");
  const failSound = new Audio("/fail.mp3");
  const winSound = new Audio("/win.mp3");

  clickSound.volume = muted ? 0 : 1;
  matchSound.volume = muted ? 0 : 1;
  failSound.volume = muted ? 0 : 1;
  winSound.volume = muted ? 0 : 1;

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    setAgents(shuffleAgents());
  }, []);

  useEffect(() => {
    if (matched.length === 14) {
      setHasWon(true);
      winSound.play();
      import("canvas-confetti").then((module) => {
        const confetti = module.default;
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
        });
      });
    }
  }, [matched]);

  const handleFlip = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    clickSound.play();
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (agents[first].name === agents[second].name) {
        setTimeout(() => {
          matchSound.play();
          setMatched((prev) => [...prev, first, second]);
        }, 400);
      } else {
        setTimeout(() => {
          failSound.play();
        }, 300);
      }
      setTimeout(() => setFlipped([]), 800);
    }
  };

  const handlePlayAgain = () => {
    setAgents(shuffleAgents());
    setFlipped([]);
    setMatched([]);
    setHasWon(false);
  };

  const toggleMute = () => setMuted((prev) => !prev);
  const toggleTheme = () => setDarkMode((prev) => !prev);

  const shareText = encodeURIComponent("🎉 I just beat the @recallnet Team Flip memory game! Play it here:");
  const shareURL = encodeURIComponent("https://recall-teammatch.vercel.app");
  const tweetLink = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareURL}`;

  return (
    <div className="game">
      <div className="toggle-bar">
        <button onClick={toggleMute} className="toggle-btn" title="Toggle Sound">
          {muted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <button onClick={toggleTheme} className="toggle-btn" title="Toggle Theme">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className="title">
        <img src="/recall-logo.png" alt="RecallNet Logo" className="title-logo" />
        <span>Recallnet Team Flip</span>
      </div>

      <h2 className="subtitle">How well can you recall the @recallnet team? Let's play...</h2>

      {hasWon && (
        <>
          <div className="fireworks">🎉✨🎇🎆🥳🧠🎉</div>
          <div className="buttons">
            <a href={tweetLink} target="_blank" rel="noopener noreferrer">
              <button className="share-button">Share on Twitter</button>
            </a>
            <button className="play-again" onClick={handlePlayAgain}>Play Again</button>
          </div>
        </>
      )}

      {agents.length === 0 ? (
        <p>Loading agents...</p>
      ) : (
        <div className="grid">
          {agents.map((agent, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index);
            return (
              <div
                key={index}
                className={`card ${isFlipped ? "flipped" : ""}`}
                onClick={() => handleFlip(index)}
              >
                <div className="inner">
                  <div className="front">
                    <img src="/recall-logo.png" alt="Recall Logo" className="logo" />
                  </div>
                  <div className="back">
                    <img src={agent.image} alt={agent.name} />
                    <div className="agent-name">{agent.name}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="footer">
        Made with <span className="heart">❤️</span> by{" "}
        <a href="https://twitter.com/everdonnew" target="_blank" rel="noopener noreferrer" className="highlight">
          everdonnew <FaTwitter className="twitter-icon" />
        </a>{" "}
        for{" "}
        <a href="https://twitter.com/recallnet" target="_blank" rel="noopener noreferrer" className="highlight">
          recallnet <FaTwitter className="twitter-icon" />
        </a>
      </p>
    </div>
  );
              }

