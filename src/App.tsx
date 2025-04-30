import { useState, useEffect, useRef, ChangeEvent } from "react";

type CharacterData = {
  character: string;
  sequence: string[];
};

function App() {
  const successSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    successSoundRef.current = new Audio("/sounds/success-beep.mp3");
  }, []);

  const symbolsList: CharacterData[] = [
    { character: "©", sequence: ["o", "c"] },
    { character: "®", sequence: ["o", "r"] },
    { character: "°", sequence: ["o", "o"] },
    { character: "±", sequence: ["+", "-"] },
    { character: "¼", sequence: ["1", "4"] },
    { character: "½", sequence: ["1", "2"] },
    { character: "¾", sequence: ["3", "4"] },
    { character: "×", sequence: ["x", "x"] },
    { character: "÷", sequence: [":", "-"] },
    { character: "…", sequence: [".", "."] },
    { character: "€", sequence: ["=", "e"] },
    { character: "™", sequence: ["t", "m"] },
  ];

  const getRandomIndex = () => Math.floor(Math.random() * symbolsList.length);

  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(getRandomIndex());
  const [successStreak, setSuccessStreak] = useState(0);

  const currentSymbol = symbolsList[currentIndex];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input);

    if (input === currentSymbol.character) {
      setSuccessStreak((prevStreak) => prevStreak + 1);

      if (successSoundRef.current) {
        successSoundRef.current.currentTime = 0;
        successSoundRef.current
          .play()
          .catch((error) => console.error("Error playing sound:", error));
      }

      setUserInput("");
      setCurrentIndex((prevIndex) => (prevIndex + 1) % symbolsList.length);
    }
  };

  const formatSequence = (sequence: string[]) => {
    const elements = [];

    elements.push(
      <span key="compose" className="key">
        compose
      </span>,
    );

    sequence.forEach((key, index) => {
      elements.push(<span key={`plus-${index}`}> + </span>);
      elements.push(
        <span key={`key-${index}`} className="key">
          {key}
        </span>,
      );
    });

    return elements;
  };

  return (
    <div className="container">
      <div className="streak">Current streak: {successStreak}</div>
      <div className="character">{currentSymbol.character}</div>
      <div className="sequence">{formatSequence(currentSymbol.sequence)}</div>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Type here..."
        autoFocus
      />
    </div>
  );
}

export default App;
