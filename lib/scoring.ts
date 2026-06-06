import type { Bet, RunOutcome } from "@/db/schema"

export type RunResults = {
    deathCount: number
    heartCount: number
    totalTimeSeconds: number
    outcome: RunOutcome
}

export type ScoreResult = {
    deathsScore: number
    heartsScore: number
    timeScore: number
    totalScore: number
}

export const MAX_DIFF = {
    deaths: 10,
    hearts: 20,
    time: 1200,
} as const

export function scoreCategory(guess: number, real: number, maxDiff: number): number {
    return Math.round(Math.max(0, 100 - (Math.abs(guess - real) / maxDiff) * 100))
}

// Hearts & time only exist if the dragon is killed, so both branch on
// prediction-vs-outcome:
//  - predicted matches actual: closeness for success, 100 for correct failure
//  - mismatch: 0
// `closeness` is only evaluated on a correctly-predicted success.
function scoreKilledCategory(
    bet: Bet,
    results: RunResults,
    closeness: () => number,
): number {
    const predictedFailure = bet.guessIsFailing
    const actualFailure = results.outcome === "failed"

    if (predictedFailure !== actualFailure) return 0
    if (actualFailure) return 100

    return closeness()
}

export function calculateScore(bet: Bet, results: RunResults): ScoreResult {
    const deathsScore = scoreCategory(bet.guessDeaths, results.deathCount, MAX_DIFF.deaths)
    const heartsScore = scoreKilledCategory(bet, results, () =>
        scoreCategory(bet.guessHearts ?? 0, results.heartCount, MAX_DIFF.hearts),
    )
    const timeScore = scoreKilledCategory(bet, results, () =>
        scoreCategory(bet.guessTime ?? 0, results.totalTimeSeconds, MAX_DIFF.time),
    )

    return {
        deathsScore,
        heartsScore,
        timeScore,
        totalScore: deathsScore + heartsScore + timeScore
    }
}

// console.log(scoreCategory(3, 3, 10)) // expect 100
// console.log(scoreCategory(4, 3, 10)) // expect 90
// console.log(scoreCategory(3, 4, 10)) // expect 90  
// console.log(scoreCategory(13, 3, 10)) // expect 0  
// console.log(scoreCategory(33, 0, 1200))  // |33-0| / 1200 = 2.75%  expect 97
