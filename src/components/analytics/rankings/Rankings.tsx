import { StateRankings } from "./StateRankings";
import { MSARankings } from "./MSARankings";

export const Rankings = () => {
  return (
    <div className="space-y-8">
      <StateRankings />
      <MSARankings />
    </div>
  );
};