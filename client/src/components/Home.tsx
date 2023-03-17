import React, { KeyboardEvent, useEffect, useRef, useState } from "react";

import { Answer } from "./Answer/Answer";
import {
  Button,
  Box,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Grow,
} from "@mui/material";
import { IconButton, InputBase, Paper } from "@mui/material";
import {
  Search as IconSearch,
  ArrowRightAlt as IconArrowRight,
  Settings,
} from "@mui/icons-material";

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
  const [open, setOpen] = useState(false);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [mode, setMode] = useState<"train" | "chat">("chat");
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

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
      .then((data) => {
        setAnswer(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));

    if (!searchResponse) {
      setLoading(false);
      throw new Error(searchResponse);
    }

    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
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
      <div>
        {/* <Button variant="contained" onClick={handleOpen}>
          Open Chatbot
        </Button> */}

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            minWidth: "30vw",
          }}
        >
          <div>
            <Button
              onClick={() => setShowSettings(!showSettings)}
              startIcon={<Settings />}
            >
              {showSettings ? "Hide" : "Show"} Mode
            </Button>

            {showSettings && (
              <div style={{ display: "inline-flex" }}>
                {/* <div>Mode</div> */}
                <Select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as "train" | "chat")}
                >
                  <MenuItem sx={{ padding: "10px" }} value="train">
                    Train
                  </MenuItem>
                  <MenuItem sx={{ padding: "10px" }} value="chat">
                    Chat
                  </MenuItem>
                </Select>
              </div>
            )}
          </div>
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "2rem",
              marginBottom: "2rem",
              borderRadius: "999px",
              boxShadow: 2,
              width: "100%",
            }}
          >
            <IconButton sx={{ p: 1, opacity: 0.5, mr: 1, borderRadius: "50%" }}>
              <IconSearch />
            </IconButton>

            <InputBase
              inputRef={inputRef}
              sx={{ ml: 1, flex: 1, height: "50px", fontSize: "16px" }}
              type="text"
              placeholder="What is a yacht brokerage?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <IconButton
              onClick={mode === "train" ? handleTrain : handleAnswer}
              sx={{
                p: 1,
                backgroundColor: "primary.main",
                borderRadius: "50%",
                "&:hover": { backgroundColor: "primary.dark" },
              }}
            >
              <IconArrowRight sx={{ fontSize: "24px", color: "white" }} />
            </IconButton>
          </Paper>

          {loading ? (
            <>
              {mode === "chat" && (
                <>
                  {/* <Typography variant="h5" fontWeight="bold">
                        Answer
                      </Typography> */}

                  <CircularProgress
                    sx={{ height: 2, width: 2, mt: 2 }}
                    color="primary"
                  />
                </>
              )}
            </>
          ) : answer ? (
            <Box>
              {/* <div style={{ margin: "2rem" }}>Answer:</div> */}
              <Answer text={answer} />
            </Box>
          ) : (
            chunks.length > 0 && <div></div>
          )}
        </Box>
      </div>
    </>
  );
}
