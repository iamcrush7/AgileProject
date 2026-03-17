"use client"

import { useState, useRef, useEffect } from "react"
import { MapPin, Check, ChevronDown } from "lucide-react"

const STATES = [
    "All Regions",
    "Assam",
    "Arunachal Pradesh",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Tripura",
    "Sikkim"
]

export function RegionSelector() {
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState(STATES[0])
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function onClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
        }
        document.addEventListener("mousedown", onClick)
        return () => document.removeEventListener("mousedown", onClick)
    }, [])

    return (
        <div ref={ref} className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-44 items-center justify-between space-x-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <span className="flex items-center space-x-2 truncate">
                    <MapPin size={16} className="text-muted" />
                    <span className="truncate">{selected}</span>
                </span>
                <ChevronDown size={14} className={`text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-md border border-border bg-surface shadow-lg">
                    <div className="max-h-64 overflow-y-auto p-1 scrollbar-thin">
                        {STATES.map((state) => (
                            <button
                                key={state}
                                onClick={() => {
                                    setSelected(state)
                                    setIsOpen(false)
                                }}
                                className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors ${selected === state
                                        ? "bg-gray-100 font-medium text-primary dark:bg-gray-800"
                                        : "text-secondary hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                            >
                                {state}
                                {selected === state && <Check size={16} className="text-primary" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
