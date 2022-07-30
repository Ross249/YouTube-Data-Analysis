import { useRef, useEffect, useState, memo } from "react";
import { axisBottom, axisLeft, scaleBand, scaleLinear, select } from "d3";
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

function Bars({
  data,
  height,
  scaleX,
  scaleY,
  onMouseEnter,
  onMouseLeave,
  type,
}) {
  return (
    <>
      {type === "year" &&
        data.map((d, index) => (
          <rect
            key={`bar-${d.year}`}
            x={scaleX(d.year)}
            y={scaleY(d.counts)}
            width={scaleX.bandwidth()}
            height={height - scaleY(d.counts)}
            fill="teal"
            onMouseEnter={(event, i) => onMouseEnter(event, index)}
            onMouseLeave={onMouseLeave}
          />
        ))}
      {type === "hour" &&
        data.map((d, index) => (
          <rect
            key={`bar-${d.hour}`}
            x={scaleX(d.hour)}
            y={scaleY(d.counts)}
            width={scaleX.bandwidth()}
            height={height - scaleY(d.counts)}
            fill="teal"
            onMouseEnter={(event, i) => onMouseEnter(event, index)}
            onMouseLeave={onMouseLeave}
          />
        ))}
    </>
  );
}

const BarChart = (props) => {
  const [tooltip, setTooltip] = useState(null);
  const type = props.type;
  const margin = { top: 10, right: 0, bottom: 20, left: 50 };
  const width = 600 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;
  const url =
    type === "year"
      ? "http://localhost:4001/api/data/yearly-count"
      : "http://localhost:4001/api/data/watch-hours";
  const { data, loading } = useFetchData(url);

  console.log(tooltip);
  let scaleX, scaleY;
  switch (type) {
    case "year":
      scaleX = scaleBand()
        .domain(data.map((d) => d.year))
        .range([0, width])
        .padding(0.5);
      scaleY = scaleLinear()
        .domain([0, Math.max(...data.map((d) => d.counts))])
        .range([height, 0]);
      break;
    case "hour":
      scaleX = scaleBand()
        .domain(data.map((d) => d.hour))
        .range([0, width])
        .padding(0.5);
      scaleY = scaleLinear()
        .domain([0, Math.max(...data.map((d) => d.counts))])
        .range([height, 0]);
      break;
    default:
      break;
  }

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
            <Bars
              data={data}
              height={height}
              scaleX={scaleX}
              scaleY={scaleY}
              onMouseEnter={(event, i) => {
                setTooltip({
                  x: event.clientX,
                  y: event.clientY,
                  index: i,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
              type={type}
            />
          </g>
        </svg>
      )}
      {tooltip !== null ? (
        <div className="tooltip" style={{ top: tooltip.y, left: tooltip.x }}>
          <span className="tooltip__title">
            {type === "year"
              ? data[tooltip.index].year
              : `Watch Video at ${data[tooltip.index].hour}`}
          </span>
          <table className="tooltip__table">
            <thead>
              <tr>
                <td>counts</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data[tooltip.index].counts}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default memo(BarChart);
