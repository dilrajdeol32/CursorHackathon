# Checkpoint

A mobile-first cognitive offload tool for nurses: save mental context before an interruption and resume with an AI-generated clinical brief.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure API key**

   Copy the example env file and add your Anthropic API key:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:

   ```
   VITE_ANTHROPIC_KEY=your_actual_anthropic_api_key
   ```

3. **Run the app**

   ```bash
   npm run dev
   ```

   Open the URL shown in the terminal (e.g. http://localhost:5173) in your browser or use a mobile viewport.

## Stack

- Vite + React (no TypeScript)
- No router; screens are switched with `useState`
- No external UI libraries; layout and styles via inline styles and `App.css`
- AI briefs via Anthropic API (Claude)

## Usage

- **Tasks (Home):** View the active task and tap **Save checkpoint** before an interruption. Choose a category (Physician, Call light, Staff, Other). The app saves your context and switches to the Resume screen.
- **Resume:** See the saved checkpoint and an AI-generated 2-sentence brief (what you completed, what to do next). Tap **Resume task** to clear the checkpoint and return to Tasks.
- **Log:** View session stats (interruption count, average duration, peak hour) and the full list of interruptions with category badges.

The Resume tab shows a red dot when a checkpoint is saved. Checkpoints left for 5+ minutes are shown with a subtle red tint on the Resume screen.
