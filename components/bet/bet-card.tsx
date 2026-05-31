"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import BetForm from "./bet-form";
import { resetBets, type ViewerBet } from "@/actions/bet";
import { splitTime } from "@/lib/utils";

export default function BetCard({ bet }: { bet: ViewerBet }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  let latestTime;

  if (bet.count == 0) {
    return <>no bets found</>;
  } else {
    latestTime = splitTime(bet.latest.guessTime);
  }

  const canEdit = bet.count < 3;

  const handleClear = () => {
    startTransition(async () => {
      const res = await resetBets();
      if (!res.success) {
        console.error(res.error);
      }
    });
  };

  if (editing) {
    return (
      <div>
        <BetForm
          onSuccessAction={() => setEditing(false)}
          initial={{
            guessDeaths: bet.latest.guessDeaths,
            guessHearts: bet.latest.guessHearts,
            hours: latestTime.hours,
            minutes: latestTime.minutes,
            seconds: latestTime.seconds,
          }}
        />
        <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Prediction</CardTitle>
        <CardAction>
          <span>{`${bet.count}/3`}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={!canEdit}
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            Clear
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Label>Hearts</Label>
        <span>{bet.latest.guessHearts}</span>
        <Label>Deaths</Label>
        <span>{bet.latest.guessDeaths}</span>
        <Label>Time</Label>
        <span>{`${latestTime.hours}:${latestTime.minutes}:${latestTime.seconds}`}</span>
      </CardContent>
    </Card>
  );
}
