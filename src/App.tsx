import { useState, useEffect, useRef, ChangeEvent } from "react";

type CharacterData = {
  character: string;
  sequence: string[];
  decks: string[];
};

function App() {
  const successSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    successSoundRef.current = new Audio(
      import.meta.env.BASE_URL + "/sounds/success-beep.mp3",
    );
  }, []);

  const symbolsList: CharacterData[] = [
    { character: "©", sequence: ["o", "c"], decks: ["Symbols"] },
    { character: "®", sequence: ["o", "r"], decks: ["Symbols"] },
    { character: "°", sequence: ["o", "o"], decks: ["Math"] },
    { character: "±", sequence: ["+", "-"], decks: ["Math"] },
    { character: "¼", sequence: ["1", "4"], decks: ["Math"] },
    { character: "½", sequence: ["1", "2"], decks: ["Math"] },
    { character: "¾", sequence: ["3", "4"], decks: ["Math"] },
    { character: "×", sequence: ["x", "x"], decks: ["Math"] },
    { character: "÷", sequence: [":", "-"], decks: ["Math"] },
    { character: "…", sequence: [".", "."], decks: ["Symbols"] },
    { character: "€", sequence: ["=", "e"], decks: ["Currencies"] },
    { character: "₤", sequence: ["=", "L"], decks: ["Currencies"] },
    { character: "¥", sequence: ["=", "Y"], decks: ["Currencies"] },
    { character: "¢", sequence: ["c", "/"], decks: ["Currencies"] },
    { character: "é", sequence: ["'", "e"], decks: ["French"] },
    { character: "è", sequence: ["`", "e"], decks: ["French"] },
    { character: "ê", sequence: ["^", "e"], decks: ["French"] },
    { character: "ë", sequence: ['"', "e"], decks: ["French"] },
    { character: "à", sequence: ["`", "a"], decks: ["French"] },
    { character: "ç", sequence: [",", "c"], decks: ["French"] },
    { character: "ô", sequence: ["^", "o"], decks: ["French"] },
    { character: "™", sequence: ["t", "m"], decks: ["Symbols"] },
  ];

  const allDecks = Array.from(
    new Set(symbolsList.flatMap((symbol) => symbol.decks)),
  ).sort();

  const [enabledDecks, setEnabledDecks] = useState<Record<string, boolean>>(
    Object.fromEntries(allDecks.map((deck) => [deck, true])),
  );

  const activeSymbols = symbolsList.filter((symbol) =>
    symbol.decks.some((deck) => enabledDecks[deck]),
  );

  const getRandomIndex = () => {
    if (activeSymbols.length === 0) return 0; // Fallback if no decks are selected
    return Math.floor(Math.random() * activeSymbols.length);
  };

  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(getRandomIndex());
  const [successStreak, setSuccessStreak] = useState(0);

  useEffect(() => {
    if (activeSymbols.length > 0) {
      setCurrentIndex(getRandomIndex());
    }
  }, [enabledDecks, activeSymbols.length]);

  useEffect(() => {
    if (activeSymbols.length > 0 && currentIndex >= activeSymbols.length) {
      setCurrentIndex(0);
    }
  }, [activeSymbols.length, currentIndex]);

  const currentSymbol =
    activeSymbols.length > 0
      ? activeSymbols[currentIndex] || symbolsList[0]
      : symbolsList[0]; // Fallback if no decks are selected

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
      if (activeSymbols.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % activeSymbols.length);
      }
    }
  };

  const handleDeckToggle = (deckName: string) => {
    setEnabledDecks((prevEnabledDecks) => ({
      ...prevEnabledDecks,
      [deckName]: !prevEnabledDecks[deckName],
    }));
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
    <div className="app-container">
      <div className="sidebar">
        <h3>Decks</h3>
        {allDecks.map((deck) => (
          <div key={deck} className="deck-option">
            <label>
              <input
                type="checkbox"
                checked={enabledDecks[deck]}
                onChange={() => handleDeckToggle(deck)}
              />
              {deck}
            </label>
          </div>
        ))}
      </div>
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
    </div>
  );
}

export default App;
