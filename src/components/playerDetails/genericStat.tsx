import { ReactNode, useCallback } from "react";
import { PlayerExtendedStats } from "../../data/types";
import StatItem from "./statItem";
import { useStatHistogram } from "./histogram";
import { Model } from "../gameRecords/model";

export function GenericStat({
  stats,
  statKey,
  description,
  formatter,
  formatterHistogram,
  label,
  hideLabel = false,
  disableHistogram = false,
  defaultValue = 0,
  hideValue = false,
  model
}: {
  stats: PlayerExtendedStats;
  statKey: keyof PlayerExtendedStats;
  description?: ReactNode;
  formatter: (value: number) => string;
  formatterHistogram?: (value: number) => string;
  label?: string;
  hideLabel?: boolean;
  disableHistogram?: boolean;
  defaultValue?: number | string;
  hideValue?: boolean;
  model?: Model;
}) {
  const value = stats[statKey] ?? defaultValue;
  if (typeof value !== "number" && value !== defaultValue) {
    throw new Error(`${statKey} is not a number`);
  }
  const extraTip = useCallback(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ret = useStatHistogram({
      statKey,
      valueFormatter: formatterHistogram || formatter,
      value: typeof value === "number" ? value : undefined,
      inputModel: model
    });
    if (disableHistogram) {
      return null;
    }
    return stats.count > 100 ? ret : null;
  }, [statKey, formatterHistogram, formatter, value, disableHistogram, stats.count]);
  return (
    <StatItem description={description} label={hideLabel ? undefined : (label || statKey)} extraTip={extraTip}>
      {hideValue ? "" : typeof value === "string" ? value : formatter(value)}
    </StatItem>
  );
}
