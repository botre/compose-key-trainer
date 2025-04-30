import {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  useMemo,
  Fragment,
} from "react";

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
  Currencies: { label: "Currencies", emoji: "💰" },
  French: { label: "French", emoji: "🇫🇷" },
  German: { label: "German", emoji: "🇩🇪" },
  Math: { label: "Math", emoji: "🧮" },
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
        {character: "¦", sequence: ["|", "|"], decks: ["Symbols"]},
        {character: "§", sequence: ["s", "o"], decks: ["Symbols"]},
        {character: "©", sequence: ["o", "c"], decks: ["Symbols"]},
        {character: "«", sequence: ["<", "<"], decks: ["Symbols", "French", "Portuguese", "Spanish"]},
        {character: "®", sequence: ["o", "r"], decks: ["Symbols"]},
        {character: "°", sequence: ["o", "o"], decks: ["Math"]},
        {character: "±", sequence: ["+", "-"], decks: ["Math"]},
        {character: "·", sequence: [".", "-"], decks: ["Symbols"]},
        {character: "»", sequence: [">", ">"], decks: ["Symbols", "French", "Portuguese", "Spanish"]},
        {character: "¼", sequence: ["1", "4"], decks: ["Math"]},
        {character: "½", sequence: ["1", "2"], decks: ["Math"]},
        {character: "¾", sequence: ["3", "4"], decks: ["Math"]},
        {character: "¿", sequence: ["?", "?"], decks: ["Symbols", "Spanish"]},
        {character: "Á", sequence: ["'", "A"], decks: ["Portuguese", "Spanish"]},
        {character: "Â", sequence: ["^", "A"], decks: ["Portuguese", "French"]},
        {character: "Ã", sequence: ["~", "A"], decks: ["Portuguese"]},
        {character: "Ä", sequence: ['"', "A"], decks: ["German"]},
        {character: "Ç", sequence: [",", "C"], decks: ["Portuguese", "French", "Spanish", "German"]},
        {character: "É", sequence: ["'", "E"], decks: ["Portuguese", "French", "Spanish"]},
        {character: "Ê", sequence: ["^", "E"], decks: ["Portuguese", "French"]},
        {character: "Í", sequence: ["'", "I"], decks: ["Portuguese", "Spanish"]},
        {character: "Ñ", sequence: ["~", "N"], decks: ["Spanish"]},
        {character: "Ó", sequence: ["'", "O"], decks: ["Portuguese", "Spanish"]},
        {character: "Ô", sequence: ["^", "O"], decks: ["Portuguese", "French"]},
        {character: "Õ", sequence: ["~", "O"], decks: ["Portuguese"]},
        {character: "Ö", sequence: ['"', "O"], decks: ["German"]},
        {character: "×", sequence: ["x", "x"], decks: ["Math"]},
        {character: "Ú", sequence: ["'", "U"], decks: ["Portuguese", "Spanish"]},
        {character: "Ü", sequence: ['"', "U"], decks: ["German"]},
        {character: "ß", sequence: ["s", "s"], decks: ["German"]},
        {character: "à", sequence: ["`", "a"], decks: ["French"]},
        {character: "á", sequence: ["'", "a"], decks: ["Portuguese", "Spanish"]},
        {character: "â", sequence: ["^", "a"], decks: ["Portuguese", "French"]},
        {character: "ã", sequence: ["~", "a"], decks: ["Portuguese"]},
        {character: "ä", sequence: ['"', "a"], decks: ["German"]},
        {character: "ç", sequence: [",", "c"], decks: ["French", "Portuguese", "Spanish", "German"]},
        {character: "è", sequence: ["`", "e"], decks: ["French"]},
        {character: "é", sequence: ["'", "e"], decks: ["French", "Portuguese", "Spanish"]},
        {character: "ê", sequence: ["^", "e"], decks: ["Portuguese", "French"]},
        {character: "ë", sequence: ['"', "e"], decks: ["French", "German"]},
        {character: "ì", sequence: ["`", "i"], decks: ["French"]},
        {character: "í", sequence: ["'", "i"], decks: ["Portuguese", "Spanish"]},
        {character: "ñ", sequence: ["~", "n"], decks: ["Spanish"]},
        {character: "ò", sequence: ["`", "o"], decks: ["French"]},
        {character: "ó", sequence: ["'", "o"], decks: ["Portuguese", "Spanish"]},
        {character: "ô", sequence: ["^", "o"], decks: ["Portuguese", "French"]},
        {character: "õ", sequence: ["~", "o"], decks: ["Portuguese"]},
        {character: "ö", sequence: ['"', "o"], decks: ["German"]},
        {character: "÷", sequence: [":", "-"], decks: ["Math"]},
        {character: "ù", sequence: ["`", "u"], decks: ["French"]},
        {character: "ú", sequence: ["'", "u"], decks: ["Portuguese", "Spanish"]},
        {character: "ü", sequence: ['"', "u"], decks: ["German"]},
        {character: "…", sequence: [".", "."], decks: ["Symbols"]},
        {character: "₤", sequence: ["=", "L"], decks: ["Currencies"]},
        {character: "€", sequence: ["=", "e"], decks: ["Currencies"]},
        {character: "™", sequence: ["t", "m"], decks: ["Symbols"]},
        {character: "←", sequence: ["<", "-"], decks: ["Symbols"]},
        {character: "↑", sequence: ["^", "|"], decks: ["Symbols"]},
        {character: "→", sequence: ["-", ">"], decks: ["Symbols"]},
        {character: "↓", sequence: ["v", "|"], decks: ["Symbols"]},
        {character: "∞", sequence: ["8", "8"], decks: ["Math"]},
        {character: "≠", sequence: ["/", "="], decks: ["Math"]},
        {character: "≤", sequence: ["<", "="], decks: ["Math"]},
        {character: "≥", sequence: [">", "="], decks: ["Math"]},
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
  const [timerActive, setTimerActive] = useState(false);

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
    setTimerActive(true);

    const timerInterval = setInterval(() => {
      setTimeLeftMs((prevTime) => {
        if (prevTime <= 100) {
          clearInterval(timerInterval);
          setTimerActive(false);
          setSuccessStreak(0);
          return 0;
        }
        return prevTime - 100;
      });
    }, 100);

    return () => clearInterval(timerInterval);
  }, [currentIndex, shuffledSymbols.length]);

  const currentSymbol =
    shuffledSymbols.length > 0 ? shuffledSymbols[currentIndex] : symbolsList[0];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input);

    if (input === currentSymbol.character) {
      if (timerActive) {
        setSuccessStreak((prevStreak) => {
          const newStreak = prevStreak + 1;

          if (successSoundRef.current) {
            successSoundRef.current.currentTime = 0;
            successSoundRef.current
              .play()
              .catch((error) => console.error("Error playing sound:", error));
          }

          return newStreak;
        });
      }

      setUserInput("");
      setTimeLeftMs(TIMER_DURATION_MS);
      setTimerActive(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledSymbols.length);
    }
  };

  const handleDeckToggle = (deckName: keyof typeof Decks) => {
    setEnabledDecks((prevEnabledDecks) => ({
      ...prevEnabledDecks,
      [deckName]: !prevEnabledDecks[deckName],
    }));
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
        <h3>Decks</h3>
        {allDecks.map((deck) => (
          <div key={deck} className="deck-option">
            <label>
              <input
                type="checkbox"
                checked={enabledDecks[deck]}
                onChange={() => handleDeckToggle(deck)}
              />
              <span style={{ opacity: 0.5 }}>{Decks[deck].emoji}</span>{" "}
              {Decks[deck].label}
            </label>
          </div>
        ))}
      </div>
      <div className="container">
        <div className="streak">Streak: {successStreak}</div>
        <div className="character">{currentSymbol.character}</div>
        <div className="sequence">{formatSequence(currentSymbol.sequence)}</div>
        <div className="timer-bar-container">
          <div
            className="timer-bar"
            style={{
              width: `${(timeLeftMs / TIMER_DURATION_MS) * 100}%`,
              backgroundColor: `rgb(${255 - (timeLeftMs / TIMER_DURATION_MS) * 105}, ${(timeLeftMs / TIMER_DURATION_MS) * 204}, 0)`,
            }}
          />
        </div>
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
