import {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  useMemo,
  Fragment,
} from "react";

type GameMode = "practice" | "challenge";

const TIMER_DURATION_MS = 5000;

type CharacterData = {
  character: string;
  sequence: string[];
  decks: (keyof typeof Decks)[];
};

type DeckInfo = {
  label: string;
  emoji: string;
};

const Decks: Record<string, DeckInfo> = {
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

function App() {
  const successSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    successSoundRef.current = new Audio(
      import.meta.env.BASE_URL + "/sounds/success-beep.mp3",
    );
  }, []);

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

  const allDecks = useMemo(
    () =>
      Array.from(new Set(symbolsList.flatMap((symbol) => symbol.decks))).sort(),
    [],
  );

  const [enabledDecks, setEnabledDecks] = useState<
    Record<keyof typeof Decks, boolean>
  >(
    Object.fromEntries(allDecks.map((deck) => [deck, true])) as Record<
      keyof typeof Decks,
      boolean
    >,
  );

  const [shuffledSymbols, setShuffledSymbols] = useState<CharacterData[]>([]);
  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [successStreak, setSuccessStreak] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(TIMER_DURATION_MS);
  const [gameMode, setGameMode] = useState<GameMode>("practice");

  const shuffleArray = (array: CharacterData[]): CharacterData[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const filtered = symbolsList.filter((symbol) =>
      symbol.decks.some((deck) => enabledDecks[deck]),
    );
    setShuffledSymbols(shuffleArray(filtered));
    setCurrentIndex(0);
  }, [enabledDecks]);

  useEffect(() => {
    if (currentIndex >= shuffledSymbols.length && shuffledSymbols.length > 0) {
      setShuffledSymbols(shuffleArray(shuffledSymbols));
      setCurrentIndex(0);
    }
  }, [currentIndex, shuffledSymbols]);

  useEffect(() => {
    setTimeLeftMs(TIMER_DURATION_MS);

    if (gameMode !== "challenge") {
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeLeftMs((prevTime) => {
        if (prevTime <= 100) {
          clearInterval(timerInterval);
          setSuccessStreak(0);
          return 0;
        }
        return prevTime - 100;
      });
    }, 100);

    return () => clearInterval(timerInterval);
  }, [currentIndex, shuffledSymbols.length, gameMode]);

  const currentSymbol =
    shuffledSymbols.length > 0 ? shuffledSymbols[currentIndex] : symbolsList[0];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input);

    if (input === currentSymbol.character) {
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
    }
  };

  const handleDeckToggle = (deckName: keyof typeof Decks) => {
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
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toggleGameMode();
            }}
            className="mode-switch-link"
          >
            Switch to {gameMode === "practice" ? "Challenge" : "Practice"} Mode
          </a>
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
