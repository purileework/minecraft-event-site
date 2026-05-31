import { getLeaderboardBets, getRun } from "@/lib/queries/leaderboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatTime } from "@/lib/utils";

const MAX_BETS = 3;

export default async function Leaderboard() {
  const rows = await getLeaderboardBets();
  const currentRun = await getRun();

  if (currentRun.netherEnterTime !== null) {
    return (
      <div>
        Poppang has entered the nether. Bets are closed. Who will win? c:
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead className="text-right">Guess Deaths</TableHead>
            <TableHead className="text-right">Guess Hearts</TableHead>
            <TableHead className="text-right">Guess Time</TableHead>
            <TableHead className="text-right">Bets Used</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No bets yet
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.username}>
                <TableCell className="font-medium">{row.username}</TableCell>
                <TableCell
                  className={cn(
                    "text-right",
                    currentRun.deathCount > row.guessDeaths &&
                      "line-through text-muted-foreground",
                  )}
                >
                  {row.guessDeaths}
                </TableCell>
                <TableCell className="text-right">{row.guessHearts}</TableCell>
                <TableCell className="text-right">
                  {formatTime(row.guessTime)}
                </TableCell>
                <TableCell className="text-right">
                  {row.betsUsed}/{MAX_BETS}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
