import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import d3Cloud from "d3-cloud";
import useData from "../hooks/useData";

const WordCloud = () => {
  const { data, loading } = useData();
  const [cloud, setCloud] = useState(null);

  const margin = { top: 30, right: 50, bottom: 30, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;
  let color = d3.scaleOrdinal(d3.schemeSet1);

  useEffect(() => {
    const fontSize = d3.scalePow().exponent(5).domain([0, 1]).range([40, 80]);
    // Adds a set of variables to each element in the data (we will use x and y later)
    d3Cloud()
      .size([width, height])
      .timeInterval(20)
      .words(data) //.rotate(function(d) { return 0; })
      .rotate(function () {
        // ~~(n) returns floor if n < 0, ceil if n>=0
        return ~~(Math.random() * 2) * 90;
      })
      .fontSize(function (d, i) {
        console.log(d);
        console.log(i);
        return fontSize(Math.random());
      })
      .fontWeight(["bold"])
      .text(function (d) {
        return d.word;
      })
      .on("end", (words) => setCloud(words))
      .start();

    return () => {
      setCloud(null);
    };
  }, [data, width, height]);
  return (
    <>
      {loading && <div>Loading</div>}
      {!loading && (
        <svg width={800} height={600}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            <g transform={`translate(${width / 2},${height / 2})`}>
              {cloud &&
                cloud.map((word, i) => (
                  <text
                    key={word.word}
                    style={{
                      fill: color(i),
                      fontSize: word.size + "px",
                      fontFamily: word.font,
                    }}
                    textAnchor="middle"
                    transform={`translate(${word.x},${word.y}) rotate(${word.rotate})`}
                  >
                    {word.text}
                  </text>
                ))}
            </g>
          </g>
        </svg>
      )}
    </>
  );
};

export default WordCloud;
