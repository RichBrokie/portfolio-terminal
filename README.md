# 💻 Terminal Portfolio

A high-fidelity, interactive "Terminal-style" developer portfolio built with React, Next.js, and Tailwind CSS. Designed to mimic a classic CRT terminal or macOS window, complete with command-line interactions, auto-scrolling, and an ASCII-inspired aesthetic.

![Terminal Portfolio Demo](https://github.com/RichBrokie/portfolio-terminal/assets/demo-placeholder.png) *(Note: Replace with actual screenshot URL later)*

## ✨ Features

- **Interactive Command Line:** Fully functional input simulating a real terminal environment.
- **Custom Commands:** Supports `help`, `projects`, `skills`, `education`, and `clear`.
- **High-Fidelity CRT Aesthetic:** Custom font styling, pure CSS-rendered glowing 'WELCOME' banner, and subtle box-shadows to recreate a retro terminal glow.
- **Dynamic Skill Matrix:** CSS-animated progress bars for technical skills.
- **Keyboard Navigation:** Use `Up`/`Down` arrow keys to cycle through your command history, just like a bash shell.
- **Auto-Scrolling:** Automatically anchors to the newest output to maintain a smooth terminal experience.
- **Smart Parsing:** Automatically converts raw URLs and emails in the output text into clickable, new-tab anchor links.

## 🛠️ Tech Stack

- **Framework:** [Next.js (App Router)](https://nextjs.org/)
- **UI Library:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Language:** TypeScript

## 🚀 Getting Started

To run this project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RichBrokie/portfolio-terminal.git
   cd portfolio-terminal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **View the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

The core logic and styling for the terminal interface is located entirely within a single, portable component:
- `src/components/ui/interactive-portfolio-terminal-component.tsx`

The application wrapper is handled natively by Next.js in `src/app/page.tsx` and `src/demo.tsx`.

## 🤝 Customization

To personalize this portfolio for yourself, open `interactive-portfolio-terminal-component.tsx` and modify the `commands` object (around line 50). You can easily update the string outputs for `projects`, `skills`, and `education`, or add entirely new commands!

---
*Developed by [RichBrokie](https://github.com/RichBrokie).*
