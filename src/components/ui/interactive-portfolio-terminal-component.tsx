'use client'

import { useState, useRef, useEffect } from 'react'
import { Terminal } from 'lucide-react'

type HistoryEntry = { command: string; output: string; isWelcome?: boolean }

const WelcomeBanner = () => (
  <div className="pl-6 py-2 select-none">
    {/* Styled WELCOME heading — crisp at any browser zoom */}
    <div
      className="text-[#4ade80] font-black tracking-[0.18em] leading-none"
      style={{
        fontSize: 'clamp(2rem, 6vw, 4.5rem)',
        textShadow: '0 0 12px rgba(74,222,128,0.6), 0 0 30px rgba(74,222,128,0.25)',
        fontFamily: '"Courier New", Courier, monospace',
        letterSpacing: '0.15em',
      }}
    >
      WELCOME
    </div>
    <div className="mt-4 text-[#4ade80]/80 text-sm space-y-0.5">
      <p className="text-[#4ade80]">[SYSTEM INITIALIZED] - Kernel: C++/Proxmox-v8.1.</p>
      <p className="text-[#4ade80]/70">Terminal Portfolio v1.0</p>
      <p className="mt-2 text-[#4ade80]/60">Type <span className="text-white">help</span> to see available commands.</p>
    </div>
  </div>
)

const SkillBar = ({ label, pct }: { label: string; pct: number }) => (
  <div className="flex items-center gap-3 text-xs sm:text-sm">
    <span className="w-52 shrink-0 text-[#4ade80]/80">{label}</span>
    <div className="flex-1 h-2.5 bg-[#1a2e1a] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-[#4ade80]"
        style={{ width: `${pct}%`, boxShadow: '0 0 6px rgba(74,222,128,0.5)' }}
      />
    </div>
    <span className="w-10 text-right text-[#4ade80]/70">{pct}%</span>
  </div>
)

export default function PortfolioTerminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { command: '/welcome', output: '__WELCOME__', isWelcome: true },
  ])
  const [currentCommand, setCurrentCommand] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: Record<string, () => string> = {
    help: () => `
[AVAILABLE_COMMANDS]

  projects    View project portfolio
  skills      Show technical skills matrix
  education   View educational background
  clear       Clear terminal screen
  help        Display this help message
    `,
    projects: () => `
[PROJECT PORTFOLIO]

1. Proxmox Home Lab
   • Focus: Virtualization, Docker containers, hands-on system administration
   • Environment: Proxmox VE 8.1
   • Impact: High availability, optimized resource allocation

2. HASS Home Server
   • Focus: Smart home automation, IoT connectivity, and local privacy
   • Features: Custom dashboards, sensor integration, automated routines
   • Tech Stack: Home Assistant, Proxmox, Docker

3. Email-to-WhatsApp Automation
   • Focus: Python scripting and LLM summarization
   • Features: Extracts key points from emails, forwards to WhatsApp
   • Tech Stack: Python, OpenAI API, Twilio
    `,
    skills: () => '__SKILLS__',
    education: () => `
[EDUCATION]

  Computer Science Freshman
  Lahore University of Management Sciences (LUMS)

  • Focus: Systems and Computational Logic
  • Core Coursework:
    - CS 100: Computational Problem Solving (C/C++, Algorithmic Thinking, Pointers)
    - CS 200: Intro to Programming (OOP, Data Structures, Memory Management, STL)
    `,
    clear: () => {
      // handled specially below
      return '__CLEAR__'
    },
  }

  const handleCommand = () => {
    const cmd = currentCommand.trim().toLowerCase()
    if (!cmd) return

    const commandFn = commands[cmd]
    const output = commandFn ? commandFn() : `Command not found: ${cmd.slice(0, 50)}\nType help to see available commands.`

    if (output === '__CLEAR__') {
      setHistory([])
    } else {
      setHistory(prev => {
        const next = [...prev, { command: currentCommand.slice(0, 200), output }]
        // Cap history to prevent unbounded memory growth
        return next.length > 100 ? next.slice(-100) : next
      })
    }

    setCurrentCommand('')
    setHistoryIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHistoryIndex(prev => {
        const newIndex = Math.min(prev + 1, history.length - 1)
        if (history.length > 0) {
          setCurrentCommand(history[history.length - 1 - newIndex]?.command || '')
        }
        return newIndex
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHistoryIndex(prev => {
        const newIndex = Math.max(prev - 1, -1)
        setCurrentCommand(newIndex === -1 ? '' : history[history.length - 1 - newIndex]?.command || '')
        return newIndex
      })
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  useEffect(() => {
    const handleClick = () => inputRef.current?.focus()
    const el = terminalRef.current
    el?.addEventListener('click', handleClick)
    return () => el?.removeEventListener('click', handleClick)
  }, [])

  const renderOutput = (output: string) => {
    if (output === '__WELCOME__') return <WelcomeBanner />

    if (output === '__SKILLS__') {
      return (
        <div className="pl-6 space-y-3 py-2">
          <p className="text-[#4ade80] font-semibold mb-2">[TECHNICAL SKILLS MATRIX]</p>
          <SkillBar label="C/C++ (Pointers, OOP, STL)" pct={100} />
          <SkillBar label="Data Structures & Algorithms" pct={85} />
          <SkillBar label="Proxmox Virtualization" pct={80} />
          <SkillBar label="Docker & Home Assistant" pct={90} />
        </div>
      )
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g

    let parts = output.split(urlRegex)
    parts = parts.flatMap(part =>
      urlRegex.test(part) ? [part] : part.split(emailRegex)
    )

    return (
      <div className="whitespace-pre-wrap text-[#4ade80]/90 pl-6 leading-relaxed">
        {parts.map((part, index) => {
          if (urlRegex.test(part)) {
            // Only allow http/https URLs — block javascript: and data: protocols
            const safeHref = /^https?:\/\//i.test(part) ? part : '#'
            return (
              <a key={index} href={safeHref} target="_blank" rel="noopener noreferrer"
                className="text-blue-400 hover:underline hover:text-blue-300 transition-colors">
                {part}
              </a>
            )
          } else if (emailRegex.test(part)) {
            return (
              <a key={index} href={`mailto:${part}`}
                className="text-blue-400 hover:underline hover:text-blue-300 transition-colors">
                {part}
              </a>
            )
          }
          return <span key={index}>{part}</span>
        })}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] text-[#4ade80] p-4 font-mono">
      <div className="w-full max-w-5xl bg-black rounded-xl overflow-hidden border border-[#4ade80]/30"
        style={{ boxShadow: '0 0 0 1px rgba(74,222,128,0.15), 0 0 30px rgba(74,222,128,0.12), 0 0 80px rgba(74,222,128,0.06)' }}>

        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#1c1c1e] border-b border-[#2c2c2e]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex-1 flex items-center justify-center gap-2 text-xs text-gray-300 font-semibold tracking-wide">
            <Terminal size={13} />
            root@lums-systems-lab: ~ | Interactive Portfolio v1.0
          </div>
          <div className="text-xs font-semibold text-gray-400">
            <span className="text-[#4ade80] animate-pulse mr-1">●</span>ONLINE
          </div>
        </div>

        {/* Terminal body */}
        <div
          ref={terminalRef}
          className="h-[70vh] overflow-y-auto p-6 space-y-5 bg-black/95 cursor-text selection:bg-[#4ade80]/20 selection:text-white text-sm sm:text-base"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#4ade80 #111' }}
        >
          {history.map((entry, i) => (
            <div key={i} className="space-y-2">
              <div className="flex gap-2 items-center">
                <span className="text-[#06b6d4] font-bold">➜</span>
                <span className="text-[#06b6d4] font-bold">user@portfolio:~$</span>
                <span className="text-white">{entry.command}</span>
              </div>
              {renderOutput(entry.output)}
            </div>
          ))}

          {/* Input row */}
          <div className="flex gap-2 items-center">
            <span className="text-[#06b6d4] font-bold">➜</span>
            <span className="text-[#06b6d4] font-bold">user@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={e => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-white caret-[#4ade80] font-medium"
              autoFocus
              spellCheck={false}
              autoComplete="off"
              maxLength={200}
            />
          </div>

          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div className="bg-[#1c1c1e] px-5 py-2 text-xs text-gray-500 border-t border-[#2c2c2e] flex justify-between items-center">
          <span>
            <span className="text-gray-400 font-semibold">Help:</span> type &apos;help&apos; &nbsp;•&nbsp;
            <span className="text-gray-400 font-semibold">History:</span> ↑ / ↓ &nbsp;•&nbsp;
            <span className="text-gray-400 font-semibold">Clear:</span> type &apos;clear&apos;
          </span>
          <span className="hidden sm:inline">Press Ctrl+C to interrupt</span>
        </div>
      </div>
    </div>
  )
}
