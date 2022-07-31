import "./App.css";
import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
import RankTable from "./components/RankTable";

function App() {
  return (
    <div className="container">
      <h1>
        <span>My YouTube Data Analysis</span>
        <span role="img" aria-label="Index pointing down emoji">
          👇
        </span>
      </h1>
      <section>
        <h2>Yearly Watched YouTube Videos</h2>
        <BarChart type={"year"} width={700} height={500} />
      </section>
      <section>
        <h2>Watch Hour (2021)</h2>
        <BarChart type={"hour"} width={700} height={500} />
      </section>
      <section>
        <h2>Times Rank</h2>
        <RankTable type={"times"} />
      </section>
      <section>
        <h2>Duration Rank</h2>
        <RankTable type={"duration"} />
      </section>
      <section>
        <h2>YouTube Video Length distribution</h2>
        <LineChart width={700} height={500} />
      </section>
    </div>
  );
}

export default App;
