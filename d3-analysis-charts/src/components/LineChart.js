import React, { useEffect, useState, useRef } from "react";
import useFetchData from "../hooks/useFetchData";
import * as d3 from "d3";

const LineChart = (props) => {
  let { width, height } = props;
  const url = "http://localhost:4001/api/data/video-length";
  const { data, loading } = useFetchData(url);
  const ref = useRef(null);

  const margin = { top: 10, right: 0, bottom: 50, left: 50 };
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  const drawChart = () => {
    // establish x and y max values
    const yMinValue = d3.min(data, (d) => d.counts);
    const yMaxValue = d3.max(data, (d) => d.counts);
    const xMinValue = d3.min(data, (d) => d.duration);
    const xMaxValue = d3.max(data, (d) => d.duration / 60);

    // create chart area
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // create scale for the x axis
    const xScale = d3
      .scaleLinear()
      .domain([xMinValue, xMaxValue])
      .range([0, width]);

    // create scale for y axis
    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([yMinValue, yMaxValue]);

    // Create x grid
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(""));

    // create y grid
    svg
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""));

    // create the x axis on the bottom
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom().scale(xScale));

    // create the y axis on the left
    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

    // create a line with x and y coordinates scaled to the data
    const line = d3
      .line()
      .x((d) => xScale(d.duration))
      .y((d) => yScale(d.counts))
      .curve(d3.curveMonotoneX);

    // draw the line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "teal")
      .attr("stroke-width", 4)
      .attr("class", "line")
      .attr("d", line);
  };

  useEffect(() => {
    if (data !== null) {
      drawChart();
    }
    return () => {
      d3.select(ref.current).selectAll("*").remove();
    };
  }, [data]);

  return (
    <>
      {loading && <div>Loading...</div>}
      {!loading && <div ref={ref} />}
    </>
  );
};

export default LineChart;
