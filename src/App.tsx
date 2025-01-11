import { useState } from "react";
import "./App.css";
import "@mantine/core/styles.css";
import { MantineProvider, Table } from "@mantine/core";
import Search from "./Search";
import StatsTable from "./StatsTable";

function App() {
  const [count, setCount] = useState(0);
  const [players, setPlayers] = useState<string[]>([]);
  const [playerStats, setPlayerStats] = useState<>([]);

  return (
    <MantineProvider>
      <Search
        handleEnterUsername={(username) => {
          if (!players.includes(username)) {
            setPlayers([...players, username]);
          }
        }}
      />
      <StatsTable data={players}/> 

    </MantineProvider>
  );
}

export default App;
