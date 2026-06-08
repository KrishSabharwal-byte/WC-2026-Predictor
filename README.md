# World Cup 2026 Predictor

Interactive FIFA World Cup 2026 bracket simulator — a functional replica of the Telegraph predictor tool.

## Features

- **12 groups (A–L)** with all 48 official teams
- Pick **1st, 2nd, 3rd, 4th** in each group
- Select **8 best third-place teams** to advance
- **Official FIFA Annex C** mapping (all 495 combinations) for Round of 32 pairings
- Full knockout path: Round of 32 → Round of 16 → Quarter-finals → Semi-finals → Final
- **Champion reveal** when you complete the final
- Progress saved automatically in your browser

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
npm run build
npm run preview
```

## How to use

1. **Group Stage** — Select a group, tap a team, then tap a position (1st–4th). Repeat for all 12 groups.
2. **Best thirds** — In the right panel, select exactly 8 third-placed teams that advance.
3. **Knockout** — Click the team you think wins each match, round by round.
4. **Your Winner** — View your predicted champion.

## Regenerate Annex C data

```bash
node scripts/generate-annex-c.mjs path/to/fifa-regulations.txt
```
