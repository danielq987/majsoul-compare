import axios, { AxiosError } from "axios";
import * as jpToEn from "./translate.json";
import { PlayerExtendedStats } from "./types";

const MIRROR = "https://5-data.amae-koromo.com/api/v2/pl4";

export const translateExtendedStats = (
  stats: PlayerExtendedStats
): PlayerExtendedStats => {
  const translatedStats: PlayerExtendedStats = {};
  const translationMap: {[key: string]: string} = jpToEn.default;
  Object.entries(stats).forEach((e) => {
    const [k, v] = e;
    if (k in jpToEn) {
      translatedStats[translationMap[k]] = v;
    } else {
      translatedStats[k] = v;
    }
  });

  return translatedStats;
};

export const fetchData = async <T>(
  path: string,
  kvOpts: { [key: string]: string }
): Promise<T | AxiosError> => {
  try {
    const response = await axios.get(`${MIRROR}/${path}`, {
      params: kvOpts,
    });
    return response as T;
  } catch (error) {
    console.error(error);
    return error as AxiosError;
  }
};

export const fetchMatchRecord = async (
  playerId: number,
  beginDate: number,
  endDate: number
) => {
  // todo
};

export const fetchExtendedStats = async (
  playerId: number,
  beginDate: number,
  endDate: number
) => {
  // todo
};
