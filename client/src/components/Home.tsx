import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { Answer } from "./Answer/Answer";

export type Chunk = {
  content: string;
  content_length: number;
  content_tokens: number;
  embedding: number[];
};
export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState<string>("");
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [mode, setMode] = useState<"train" | "chat">("chat");

  const apiKey = "";
  const handleTrain = async () => {
    setLoading(true);

    const searchResponse = await fetch("/openai-api/train", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiKey }),
    });

    if (!searchResponse.ok) {
      setLoading(false);
      throw new Error(searchResponse.statusText);
    }

    const results: Chunk[] = await searchResponse.json();

    setChunks(results);

    setLoading(false);

    inputRef.current?.focus();

    return results;
  };

  const handleAnswer = async () => {
    if (!query) {
      alert("Please enter a query.");
      return;
    }

    setChunks([]);

    setLoading(true);

    const searchResponse = fetch("/openai-api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: query, apiKey }),
    })
      .then((res) => res.json())
      .then((data) => setAnswer(data))
      .catch((err) => console.error(err));

    setLoading(false);

    if (!searchResponse) {
      setLoading(false);
      throw new Error(searchResponse);
    }

    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (mode === "train") {
        handleTrain();
      } else {
        handleAnswer();
      }
    }
  };

  useEffect(() => {
    const MODE = localStorage.getItem("MODE");

    if (MODE) {
      setMode(MODE as "train" | "chat");
    }

    inputRef.current?.focus();
  }, []);

  return (
    <>
      <div className="flex flex-col h-screen">
        <br></br>
        <div className="flex-1 overflow-auto">
          <div className="mx-auto flex h-full w-full max-w-[750px] flex-col items-center px-3 pt-4 sm:pt-8">
            <button
              className="mt-4 flex cursor-pointer items-center space-x-2 rounded-full border border-zinc-600 px-3 py-1 text-sm hover:opacity-50"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? "Hide" : "Show"} Settings
            </button>

            {showSettings && (
              <div className="w-[340px] sm:w-[400px]">
                <div>
                  <div>Mode</div>
                  <select
                    className="max-w-[400px] block w-full cursor-pointer rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    value={mode}
                    onChange={(e) =>
                      setMode(e.target.value as "train" | "chat")
                    }
                  >
                    <option value="train">TrainHuj</option>
                    <option value="chat">Chat hujat</option>
                  </select>
                </div>
              </div>
            )}
            <div className="relative w-full mt-4">
              <IconSearch className="absolute top-3 w-10 left-1 h-6 rounded-full opacity-50 sm:left-3 sm:top-4 sm:h-8" />

              <input
                ref={inputRef}
                className="h-12 w-full rounded-full border border-zinc-600 pr-12 pl-11 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 sm:h-16 sm:py-2 sm:pr-16 sm:pl-16 sm:text-lg"
                type="text"
                placeholder="What is a yacht brokerage?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <button>
                <IconArrowRight
                  onClick={mode === "train" ? handleTrain : handleAnswer}
                  className="absolute right-2 top-2.5 h-7 w-7 rounded-full bg-blue-500 p-1 hover:cursor-pointer hover:bg-blue-600 sm:right-3 sm:top-3 sm:h-10 sm:w-10 text-white"
                />
              </button>
            </div>

            {loading ? (
              <div className="mt-6 w-full">
                {mode === "chat" && (
                  <>
                    <div className="font-bold text-2xl">Answer</div>
                    <div className="animate-pulse mt-2">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                    </div>
                  </>
                )}
              </div>
            ) : answer ? (
              <div className="mt-6">
                <div className="font-bold text-2xl mb-2">Answer:</div>
                <Answer text={answer} />
              </div>
            ) : (
              chunks.length > 0 && <div className="mt-6 pb-16"></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
