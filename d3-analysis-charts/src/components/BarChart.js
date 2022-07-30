import React, { useRef, useEffect } from "react";
import {
  axisBottom,
  axisLeft,
  ScaleBand,
  scaleBand,
  ScaleLinear,
  scaleLinear,
  select,
} from "d3";
import useFetchData from "../hooks/useFetchData";
import "./charts.css";

function AxisBottom({ scale, transform }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      select(ref.current).call(axisBottom(scale));
    }
  }, [scale]);

  return <g ref={ref} transform={transform} />;
}

function AxisLeft({ scale }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      select(ref.current).call(axisLeft(scale));
    }
  }, [scale]);

  return <g ref={ref} />;
}

function Bars({ data, height, scaleX, scaleY }) {
  return (
    <>
      {data.map((d) => (
        <rect
          key={`bar-${d.year}`}
          x={scaleX(d.year)}
          y={scaleY(d.counts)}
          width={scaleX.bandwidth()}
          height={height - scaleY(d.counts)}
          fill="teal"
        />
      ))}
    </>
  );
}

const BarChart = (props) => {
  const type = props.type;
  const margin = { top: 10, right: 0, bottom: 20, left: 50 };
  const width = 600 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;
  const url =
    type === "year"
      ? "http://localhost:4001/api/data/yearly-count"
      : "http://localhost:4001/api/data/watch-hours";
  const { data, loading } = useFetchData(url);

  console.log(data);
  const scaleX = scaleBand()
    .domain(data.map((d) => d.year))
    .range([0, width])
    .padding(0.5);
  const scaleY = scaleLinear()
    .domain([0, Math.max(...data.map((d) => d.counts))])
    .range([height, 0]);

  return (
    <div>
      {loading && <div>Loading</div>}
      {!loading && (
        <svg
          width={width + margin.left + margin.right}
          height={height + margin.top + margin.bottom}
        >
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            <AxisBottom scale={scaleX} transform={`translate(0, ${height})`} />
            <AxisLeft scale={scaleY} />
            <Bars data={data} height={height} scaleX={scaleX} scaleY={scaleY} />
          </g>
        </svg>
      )}
    </div>
  );
};

export default BarChart;
