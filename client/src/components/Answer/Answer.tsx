import { Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "./answer.module.css";

interface AnswerProps {
  text: string;
}

export const Answer: React.FC<AnswerProps> = ({ text }) => {
  const [words, setWords] = useState<string>("");

  useEffect(() => {
    setWords(text);
  }, [text]);

  return (
    <div>
      <Typography style={{ textAlign: 'left' }} className={styles.fadeIn}>{words}</Typography>
    </div>
  );
};
