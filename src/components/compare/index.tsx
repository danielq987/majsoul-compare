import { Box, Typography } from "@mui/material";
import { PlayerSearch } from "../gameRecords/playerSearch";
import { useState } from "react";
import { PlayerMetadataLite } from "../../data/types";

export default function Compare() {
  const [players, setPlayers] = useState<PlayerMetadataLite[]>([]);

  const onSelect = (selectedPlayer: PlayerMetadataLite) => {
    setPlayers([...players, selectedPlayer]);
  };

  return (
    <>
      <Typography variant="h4" mb={3} textAlign="center">
        Compare
      </Typography>
      <Box mb={5}>
        <PlayerSearch onSelect={onSelect} />
      </Box>
      <Typography variant="body1">
        {players.map((player) => JSON.stringify(player))}
      </Typography>
    </>
  );
}