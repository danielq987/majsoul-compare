import {
  Box,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { PlayerSearch } from "../gameRecords/playerSearch";
import { useEffect, useMemo, useState } from "react";
import {
  GameMode,
  PlayerExtendedStats,
  PlayerMetadata,
  PlayerMetadataLite,
} from "../../data/types";
import { createProvider } from "../gameRecords/dataAdapterProvider";
import { Model, PlayerModel } from "../gameRecords/model";
import { Trans, useTranslation } from "react-i18next";
import { GenericStat } from "../playerDetails/genericStat";
import { formatPercent, formatRound } from "../../utils";
import { ModeSelector } from "../gameRecords/modeSelector";
import DateRangeSetting from "../playerDetails/dateRangeSetting";
import { set } from "lodash";

type PlayerData = {
  [k: string]: PlayerMetadata | null;
};

type Limit = 50 | 100 | 200 | 500;

export default function Compare() {
  const [players, setPlayers] = useState<PlayerMetadataLite[]>([]);
  const [playerData, setPlayerData] = useState<PlayerData>({});
  const [selectedMode, setSelectedMode] = useState<GameMode>(12);
  const [selectedLimit, setSelectedLimit] = useState<Limit>(100);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const models: PlayerModel[] = useMemo(() => {
    return players.map((player) => {
      return {
        type: "player",
        playerId: player.id.toString(),
        startDate: null,
        endDate: null,
        selectedModes: [selectedMode],
        searchText: "",
        rank: null,
        kontenOnly: false,
        limit: 100,
      };
    });
  }, [players, selectedMode]);

  const loaders = useMemo(() => {
    return models.map((model) => {
      const provider = createProvider(model);

      return {
        playerId: model.playerId,
        mode: model.selectedModes[0],
        provider,
      };
    });
  }, [models]);

  const getCacheKey = (playerId: string, mode: GameMode) =>
    `${playerId}-${mode}`;

  useEffect(() => {
    const fetchData = async () => {
      const requiredLoaders = loaders.filter((loader) => {
        const { playerId, mode, provider } = loader;
        const cacheKey = getCacheKey(playerId, mode);
        return !(cacheKey in playerData);
      });

      try {
        console.log(requiredLoaders);
        const promises = requiredLoaders.map((loader) => {
          const { playerId, mode, provider } = loader;
          const cacheKey = getCacheKey(playerId, mode);
          const fetchInner = async () => {
            await provider.getCount();
            console.log(`Done fetching for ${cacheKey}`);
            for (let i = 0; ; i++) {
              const item = await provider.getItem(i);
              if (!item) {
                break;
              }
              console.log(item);
            }
            const metadata = provider.getMetadataSync() as PlayerMetadata;
            while (
              !metadata.extended_stats ||
              metadata.extended_stats instanceof Promise
            ) {
              await new Promise((r) => setTimeout(r, 100));
            }
            return { [cacheKey]: metadata };
          };

          return fetchInner();
        });
        const metadatas = await Promise.all(promises);
        metadatas.map((metadata) => {
          console.log(`Setting metadata for ${Object.keys(metadata)}`);
          setPlayerData({
            ...playerData,
            ...metadata,
          });
        });
      } catch (error) {
        console.error("Compare fetch data error", error);
      }
    };

    fetchData();
  }, [loaders, selectedMode]);

  const playerIds = players.map((player) => player.id);

  const onSelect = (selectedPlayer: PlayerMetadataLite) => {
    if (!playerIds.includes(selectedPlayer.id)) {
      setPlayers([...players, selectedPlayer]);
    }
  };

  const stats: {
    statKey: keyof PlayerExtendedStats | string;
    value?: (metadata: PlayerMetadata) => number;
    formatter: (x: any) => string;
    disableHistogram?: boolean;
  }[] = [
    {
      statKey: "记录场数",
      value: (metadata) => metadata.count,
      formatter: formatPercent,
      disableHistogram: true,
    },
    {
      statKey: "和牌率", // "Win rate",
      formatter: formatPercent,
    },
    {
      statKey: "放铳率", // "Deal-in rate",
      formatter: formatPercent,
    },
    {
      statKey: "净打点效率", // "Net win efficiency",
      formatter: formatRound,
    },
    {
      statKey: "自摸率", // "Tsumo rate",
      formatter: formatPercent,
    },
    {
      statKey: "默听率", // "Dama rate",
      formatter: formatPercent,
    },
    {
      statKey: "副露率", // "Call rate",
      formatter: formatPercent,
    },
    {
      statKey: "立直率", // "Riichi rate",
      formatter: formatPercent,
    },
    {
      statKey: "役满", // "Yakuman",
      formatter: formatRound,
    },
    {
      statKey: "一发率", // "Ippatsu rate",
      formatter: formatPercent,
    },
    {
      statKey: "里宝率", // "Uradora rate",
      formatter: formatPercent,
    },
    //"安定段位", // "Stable rank",
    // "记录等级", // "Current rank",
  ];

  return (
    <>
      <Typography variant="h4" mb={3} textAlign="center">
        Compare - Last {selectedLimit} Games
      </Typography>
      <Box>
        <PlayerSearch onSelect={onSelect} />
      </Box>
      {/* <Typography variant="body1">
        {players.map((player) => JSON.stringify(player))}
        {players.map((player) =>
          JSON.stringify(playerData[player.id]?.extended_stats)
        )}
      </Typography> */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        mt={3}
        mb={3}
      >
        <ModeSelector
          mode={[selectedMode]}
          onChange={(modes) => setSelectedMode(modes[0])}
          type="radio"
        />
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedLimit}
          label="Age"
          onChange={(e) => setSelectedLimit(e.target.value as Limit)}
        >
          {[50, 100, 200, 500].map((x) => (
            <MenuItem dense key={x} value={x}>
              <Trans defaults="最近 {{x}} 场" count={x} values={{ x }} />
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "200px" }}>Stat</TableCell>
            {players.map((player) => (
              <TableCell key={player.id}>{player.nickname}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {stats.map(({ statKey, value, formatter, disableHistogram }) => (
            <TableRow key={statKey}>
              <TableCell>{t(statKey)}</TableCell>
              {models.map((model) => {
                const cacheKey = getCacheKey(
                  model.playerId,
                  model.selectedModes[0]
                );
                let cellContents;
                const metadata = playerData[cacheKey];
                if (
                  !(cacheKey in playerData) ||
                  !playerData[cacheKey] ||
                  !playerData[cacheKey]!.extended_stats
                ) {
                  cellContents = "Loading";
                } else {
                  const extendedStats = playerData[cacheKey]!.extended_stats!;
                  // console.log(extendedStats);

                  if (value) {
                    cellContents = value(playerData[cacheKey]!);
                  } else {
                    cellContents = extendedStats ? (
                      <GenericStat
                        stats={extendedStats as PlayerExtendedStats}
                        formatter={formatter}
                        statKey={statKey as keyof PlayerExtendedStats}
                        hideLabel={true}
                        model={model}
                        disableHistogram={disableHistogram}
                      />
                    ) : (
                      "Loading"
                    );
                  }
                }

                return (
                  <TableCell key={model.playerId}>{cellContents}</TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
