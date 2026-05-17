import { useState, useEffect, useRef, ChangeEvent, Fragment } from "react";

type GameMode = "practice" | "challenge";

const TIMER_DURATION_MS = 5000;

type DeckName =
  | "Arrows"
  | "Currencies"
  | "French"
  | "German"
  | "Math"
  | "Music"
  | "Portuguese"
  | "Spanish"
  | "Symbols";

type CharacterData = {
  character: string;
  sequence: string[];
  decks: DeckName[];
};

type DeckInfo = {
  label: string;
  emoji: string;
};

const Decks: Record<DeckName, DeckInfo> = {
  Arrows: { label: "Arrows", emoji: "➡️" },
  Currencies: { label: "Currencies", emoji: "💰" },
  French: { label: "French", emoji: "🇫🇷" },
  German: { label: "German", emoji: "🇩🇪" },
  Math: { label: "Math", emoji: "🧮" },
  Music: { label: "Music", emoji: "🎵" },
  Portuguese: { label: "Portuguese", emoji: "🇵🇹" },
  Spanish: { label: "Spanish", emoji: "🇪🇸" },
  Symbols: { label: "Symbols", emoji: "🔣" },
};

// https://help.ubuntu.com/community/GtkComposeTable
// prettier-ignore
const symbolsList: CharacterData[] = [
      {character: "¡", sequence: ["!", "!"], decks: ["Symbols", "Spanish"]},
      {character: "¢", sequence: ["c", "/"], decks: ["Currencies"]},
      {character: "£", sequence: ["-", "L"], decks: ["Currencies"]},
      {character: "¤", sequence: ["o", "x"], decks: ["Currencies"]},
      {character: "¥", sequence: ["=", "Y"], decks: ["Currencies"]},
      {character: "§", sequence: ["s", "o"], decks: ["Symbols"]},
      {character: "©", sequence: ["o", "c"], decks: ["Symbols"]},
      {character: "«", sequence: ["<", "<"], decks: ["Arrows", "Symbols", "French", "Portuguese", "Spanish"]},
      {character: "®", sequence: ["o", "r"], decks: ["Symbols"]},
      {character: "°", sequence: ["o", "o"], decks: ["Math"]},
      {character: "±", sequence: ["+", "-"], decks: ["Math"]},
      {character: "·", sequence: [".", "-"], decks: ["Symbols"]},
      {character: "»", sequence: [">", ">"], decks: ["Arrows", "Symbols", "French", "Portuguese", "Spanish"]},
      {character: "¼", sequence: ["1", "4"], decks: ["Math"]},
      {character: "½", sequence: ["1", "2"], decks: ["Math"]},
      {character: "¾", sequence: ["3", "4"], decks: ["Math"]},
      {character: "¿", sequence: ["?", "?"], decks: ["Symbols", "Spanish"]},
      {character: "À", sequence: ["`", "A"], decks: ["French"]},
      {character: "Á", sequence: ["'", "A"], decks: ["Portuguese", "Spanish"]},
      {character: "Â", sequence: ["^", "A"], decks: ["Portuguese", "French"]},
      {character: "Ã", sequence: ["~", "A"], decks: ["Portuguese"]},
      {character: "Ä", sequence: ['"', "A"], decks: ["German"]},
      {character: "Æ", sequence: ["A", "E"], decks: ["French"]},
      {character: "Ç", sequence: [",", "C"], decks: ["Portuguese", "French", "Spanish"]},
      {character: "È", sequence: ["`", "E"], decks: ["French"]},
      {character: "É", sequence: ["'", "E"], decks: ["Portuguese", "French", "Spanish"]},
      {character: "Ê", sequence: ["^", "E"], decks: ["Portuguese", "French"]},
      {character: "Ë", sequence: ['"', "E"], decks: ["French"]},
      {character: "Í", sequence: ["'", "I"], decks: ["Portuguese", "Spanish"]},
      {character: "Î", sequence: ["^", "I"], decks: ["French"]},
      {character: "Ï", sequence: ['"', "I"], decks: ["French"]},
      {character: "Ñ", sequence: ["~", "N"], decks: ["Spanish"]},
      {character: "Ó", sequence: ["'", "O"], decks: ["Portuguese", "Spanish"]},
      {character: "Ô", sequence: ["^", "O"], decks: ["Portuguese", "French"]},
      {character: "Õ", sequence: ["~", "O"], decks: ["Portuguese"]},
      {character: "Ö", sequence: ['"', "O"], decks: ["German"]},
      {character: "×", sequence: ["x", "x"], decks: ["Math"]},
      {character: "Ù", sequence: ["`", "U"], decks: ["French"]},
      {character: "Ú", sequence: ["'", "U"], decks: ["Portuguese", "Spanish"]},
      {character: "Û", sequence: ["^", "U"], decks: ["French"]},
      {character: "Ü", sequence: ['"', "U"], decks: ["German"]},
      {character: "ß", sequence: ["s", "s"], decks: ["German"]},
      {character: "à", sequence: ["`", "a"], decks: ["French"]},
      {character: "á", sequence: ["'", "a"], decks: ["Portuguese", "Spanish"]},
      {character: "â", sequence: ["^", "a"], decks: ["Portuguese", "French"]},
      {character: "ã", sequence: ["~", "a"], decks: ["Portuguese"]},
      {character: "ä", sequence: ['"', "a"], decks: ["German"]},
      {character: "æ", sequence: ["a", "e"], decks: ["French"]},
      {character: "ç", sequence: [",", "c"], decks: ["French", "Portuguese", "Spanish"]},
      {character: "è", sequence: ["`", "e"], decks: ["French"]},
      {character: "é", sequence: ["'", "e"], decks: ["French", "Portuguese", "Spanish"]},
      {character: "ê", sequence: ["^", "e"], decks: ["Portuguese", "French"]},
      {character: "ë", sequence: ['"', "e"], decks: ["French", "German"]},
      {character: "ì", sequence: ["`", "i"], decks: ["French"]},
      {character: "í", sequence: ["'", "i"], decks: ["Portuguese", "Spanish"]},
      {character: "î", sequence: ["^", "i"], decks: ["French"]},
      {character: "ï", sequence: ['"', "i"], decks: ["French"]},
      {character: "ñ", sequence: ["~", "n"], decks: ["Spanish"]},
      {character: "ò", sequence: ["`", "o"], decks: ["French"]},
      {character: "ó", sequence: ["'", "o"], decks: ["Portuguese", "Spanish"]},
      {character: "ô", sequence: ["^", "o"], decks: ["Portuguese", "French"]},
      {character: "õ", sequence: ["~", "o"], decks: ["Portuguese"]},
      {character: "ö", sequence: ['"', "o"], decks: ["German"]},
      {character: "÷", sequence: [":", "-"], decks: ["Math"]},
      {character: "ù", sequence: ["`", "u"], decks: ["French"]},
      {character: "ú", sequence: ["'", "u"], decks: ["Portuguese", "Spanish"]},
      {character: "û", sequence: ["^", "u"], decks: ["French"]},
      {character: "ü", sequence: ['"', "u"], decks: ["German"]},
      {character: "Œ", sequence: ["O", "E"], decks: ["French"]},
      {character: "œ", sequence: ["o", "e"], decks: ["French"]},
      {character: "•", sequence: [".", "="], decks: ["Symbols"]},
      {character: "…", sequence: [".", "."], decks: ["Symbols"]},
      {character: "₤", sequence: ["=", "L"], decks: ["Currencies"]},
      {character: "€", sequence: ["=", "e"], decks: ["Currencies"]},
      {character: "™", sequence: ["t", "m"], decks: ["Symbols"]},
      {character: "←", sequence: ["<", "-"], decks: ["Arrows"]},
      {character: "↑", sequence: ["^", "|"], decks: ["Arrows"]},
      {character: "→", sequence: ["-", ">"], decks: ["Arrows"]},
      {character: "↓", sequence: ["v", "|"], decks: ["Arrows"]},
      {character: "⇐", sequence: ["=", "<"], decks: ["Arrows"]},
      {character: "⇑", sequence: ["=", "^"], decks: ["Arrows"]},
      {character: "⇒", sequence: ["=", ">"], decks: ["Arrows"]},
      {character: "∞", sequence: ["8", "8"], decks: ["Math"]},
      {character: "≠", sequence: ["/", "="], decks: ["Math"]},
      {character: "≤", sequence: ["<", "="], decks: ["Math"]},
      {character: "≥", sequence: [">", "="], decks: ["Math"]},
      {character: "♩", sequence: ["#", "q"], decks: ["Music"]},
      {character: "♪", sequence: ["#", "e"], decks: ["Music"]},
      {character: "♫", sequence: ["#", "E"], decks: ["Music"]},
      {character: "♬", sequence: ["#", "S"], decks: ["Music"]},
      {character: "♭", sequence: ["#", "b"], decks: ["Music"]},
      {character: "♮", sequence: ["#", "f"], decks: ["Music"]},
      {character: "♯", sequence: ["#", "#"], decks: ["Music"]},
  ];

const allDecks = Array.from(
  new Set(symbolsList.flatMap((symbol) => symbol.decks)),
).sort();

const shuffleArray = (array: CharacterData[]): CharacterData[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const formatSequence = (sequence: string[]) => (
  <>
    <span key="compose" className="key">
      compose
    </span>
    {sequence.map((key, index) => (
      <Fragment key={`key-group-${index}`}>
        <span> + </span>
        <span className="key">{key}</span>
      </Fragment>
    ))}
  </>
);

function App() {
  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    successSoundRef.current = new Audio(
      import.meta.env.BASE_URL + "sounds/success-beep.mp3",
    );
  }, []);

  const [enabledDecks, setEnabledDecks] = useState<Record<DeckName, boolean>>(
    () =>
      Object.fromEntries(allDecks.map((deck) => [deck, true])) as Record<
        DeckName,
        boolean
      >,
  );

  const [shuffledSymbols, setShuffledSymbols] = useState<CharacterData[]>([]);
  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [successStreak, setSuccessStreak] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(TIMER_DURATION_MS);
  const [gameMode, setGameMode] = useState<GameMode>("practice");
  const [isWrong, setIsWrong] = useState(false);

  useEffect(() => {
    const filtered = symbolsList.filter((symbol) =>
      symbol.decks.some((deck) => enabledDecks[deck]),
    );
    setShuffledSymbols(shuffleArray(filtered));
    setCurrentIndex(0);
  }, [enabledDecks]);

  useEffect(() => {
    if (currentIndex >= shuffledSymbols.length && shuffledSymbols.length > 0) {
      setShuffledSymbols((prev) => shuffleArray(prev));
      setCurrentIndex(0);
    }
  }, [currentIndex, shuffledSymbols]);

  // Reset per-card UI state whenever the symbol changes.
  useEffect(() => {
    setIsWrong(false);
    inputRef.current?.focus();
  }, [currentIndex, gameMode]);

  // Challenge-mode countdown timer.
  useEffect(() => {
    setTimeLeftMs(TIMER_DURATION_MS);

    if (gameMode !== "challenge" || shuffledSymbols.length === 0) {
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeLeftMs((prevTime) => Math.max(0, prevTime - 100));
    }, 100);

    return () => clearInterval(timerInterval);
  }, [currentIndex, shuffledSymbols.length, gameMode]);

  // When the challenge timer runs out, reset the streak and move on.
  useEffect(() => {
    if (
      gameMode === "challenge" &&
      timeLeftMs === 0 &&
      shuffledSymbols.length > 0
    ) {
      setSuccessStreak(0);
      setUserInput("");
      setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledSymbols.length);
    }
  }, [timeLeftMs, gameMode, shuffledSymbols.length]);

  const hasSymbols = shuffledSymbols.length > 0;
  const currentSymbol = hasSymbols ? shuffledSymbols[currentIndex] : undefined;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input);

    if (!currentSymbol) {
      return;
    }

    if (input === currentSymbol.character) {
      setIsWrong(false);

      if (successSoundRef.current) {
        successSoundRef.current.currentTime = 0;
        successSoundRef.current
          .play()
          .catch((error) => console.error("Error playing sound:", error));
      }

      if (gameMode === "challenge") {
        setSuccessStreak((prevStreak) => prevStreak + 1);
        setTimeLeftMs(TIMER_DURATION_MS);
      }

      setUserInput("");
      setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledSymbols.length);
    } else {
      setIsWrong(input.length > 0);
    }
  };

  const handleDeckToggle = (deckName: DeckName) => {
    setEnabledDecks((prevEnabledDecks) => ({
      ...prevEnabledDecks,
      [deckName]: !prevEnabledDecks[deckName],
    }));
  };

  const toggleGameMode = () => {
    setGameMode((prevMode) =>
      prevMode === "practice" ? "challenge" : "practice",
    );
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h3>Mode</h3>
        <div className="mode-toggle">
          <div className="mode-label">
            <span className="subtle-emoji">
              {gameMode === "practice" ? "🎓" : "🏆"}
            </span>{" "}
            {gameMode === "practice" ? "Practice" : "Challenge"}
          </div>
          <button
            type="button"
            onClick={toggleGameMode}
            className="mode-switch-link"
          >
            Switch to {gameMode === "practice" ? "Challenge" : "Practice"} Mode
          </button>
        </div>

        <h3>Decks</h3>
        {allDecks.map((deck) => (
          <div key={deck} className="deck-option">
            <label>
              <input
                type="checkbox"
                checked={enabledDecks[deck]}
                onChange={() => handleDeckToggle(deck)}
              />
              <span className="subtle-emoji">{Decks[deck].emoji}</span>{" "}
              {Decks[deck].label}
            </label>
          </div>
        ))}
      </div>
      <div className="container">
        {currentSymbol ? (
          <>
            {gameMode === "challenge" && (
              <div className="streak">Streak: {successStreak}</div>
            )}
            <div className="character">{currentSymbol.character}</div>
            {gameMode === "practice" && (
              <div className="sequence">
                {formatSequence(currentSymbol.sequence)}
              </div>
            )}
            {gameMode === "challenge" && (
              <div className="timer-bar-container">
                <div
                  className="timer-bar"
                  style={{
                    width: `${(timeLeftMs / TIMER_DURATION_MS) * 100}%`,
                    backgroundColor: `rgb(${255 - (timeLeftMs / TIMER_DURATION_MS) * 105}, ${(timeLeftMs / TIMER_DURATION_MS) * 204}, 0)`,
                  }}
                />
              </div>
            )}
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className={isWrong ? "input-wrong" : undefined}
              placeholder="Type here..."
              aria-label="Type the character shown above"
              autoComplete="off"
              autoFocus
            />
          </>
        ) : (
          <div className="empty-state">
            Select at least one deck to start practising.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
