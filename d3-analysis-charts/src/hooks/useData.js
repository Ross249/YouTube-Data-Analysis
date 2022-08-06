import { useState, useEffect } from "react";
import words from "../data/word_count.json";

const useData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      try {
        for (let i = 0; i < 50; i++) {
          data.push({ word: words[i].word, count: words[i].weight });
        }
        setData(words);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    setLoading(false);

    return () => {
      setData([]);
      setLoading(true);
    };
  }, []);

  return { data, loading };
};

export default useData;
