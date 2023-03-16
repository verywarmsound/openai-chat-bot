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
      <span className={styles.fadeIn}>{words}</span>
    </div>
  );
};
