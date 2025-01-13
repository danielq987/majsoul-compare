import { Box, Typography } from "@mui/material";
import { PlayerSearch } from "../gameRecords/playerSearch";
import { useEffect, useMemo, useState } from "react";
import { Metadata, PlayerMetadata, PlayerMetadataLite } from "../../data/types";
import {
  createProvider,
  DataAdapterProvider,
  useDataAdapter,
} from "../gameRecords/dataAdapterProvider";
import { Model, useModel } from "../gameRecords/model";
import { networkError } from "../../utils/notify";

type PlayerData = {
  [k: number]: PlayerMetadata | null;
};

export default function Compare() {
  const [players, setPlayers] = useState<PlayerMetadataLite[]>([]);
  const [playerData, setPlayerData] = useState<PlayerData>({});

  const latestDataAdapter = useDataAdapter();

  const [dataAdapter, setDataAdapter] = useState(latestDataAdapter);
  // useEffect(() => {
  //   setDataAdapter(latestDataAdapter);
  // }, [latestDataAdapter, dataAdapter]);
  // const metadata = dataAdapter.getMetadata<PlayerMetadata>();
  const loaders = useMemo(() => {
    return players.map((player) => {
      const provider = createProvider({
        type: "player",
        playerId: player.id.toString(),
        startDate: null,
        endDate: null,
        selectedModes: [12],
        searchText: "",
        rank: null,
        kontenOnly: false,
        limit: null,
      } as Model);

      return {
        playerId: player.id,
        player,
        provider,
      };
    });
  }, [players]);

  useEffect(() => {
    loaders.forEach(async ({ playerId, provider }) => {
      if (playerId in playerData) {
        return;
      }
      await provider.getCount();
      setPlayerData({ ...playerData, [playerId]: provider.getMetadataSync() as PlayerMetadata });
    });
  }, [loaders]);

  const playerIds = players.map((player) => player.id);

  const onSelect = (selectedPlayer: PlayerMetadataLite) => {
    if (!playerIds.includes(selectedPlayer.id)) {
      setPlayers([...players, selectedPlayer]);
    }
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
        {players.map((player) => JSON.stringify(playerData[player.id]?.extended_stats))}
      </Typography>
    </>
  );
}

/**
 * TODO:
 * Get all data from API and splatter it all over the screen (is performance important)
 *   This goes into useeffect here in the compare component ig
 * Put the data into tabular form. choose a good table library
 * Choose relevant stats that are important.
 * Choose an alternative dataviz (sliders? with tick marks for quartiles?)
 */
