import type { Bet } from "@/db/schema"

export type RunResults = {
    deathCount: number
    heartCount: number
    totalTimeSeconds: number
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


export function calculateScore(bet: Bet, results: RunResults): ScoreResult {
    const deathsScore = scoreCategory(bet.guessDeaths, results.deathCount, MAX_DIFF.deaths)
    const heartsScore = scoreCategory(bet.guessHearts, results.heartCount, MAX_DIFF.hearts)
    const timeScore = scoreCategory(bet.guessTime, results.totalTimeSeconds, MAX_DIFF.time)

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
