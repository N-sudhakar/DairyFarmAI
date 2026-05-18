import React from 'react';

export default function GaugeChart({ value, max = 100, size = 180, label = '' }) {
    const radius = (size - 20) / 2;
    const circumference = Math.PI * radius;
    const percentage = Math.min(value / max, 1);
    const offset = circumference * (1 - percentage);

    const getColor = (val) => {
        if (val >= 80) return '#d4a039';
        if (val >= 60) return '#c4704c';
        if (val >= 40) return '#b8872e';
        return '#c0392b';
    };

    const color = getColor(value);

    return (
        <div className="gauge-container">
            <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
                {/* Background arc */}
                <path
                    d={`M 10 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="10"
                    strokeLinecap="round"
                />
                {/* Value arc */}
                <path
                    d={`M 10 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                        filter: `drop-shadow(0 0 8px ${color}50)`,
                        transition: 'stroke-dashoffset 1s ease-out',
                    }}
                />
                {/* Value text */}
                <text
                    x={size / 2}
                    y={size / 2}
                    textAnchor="middle"
                    fill="white"
                    fontSize="32"
                    fontFamily="DM Serif Display, Outfit, serif"
                    fontWeight="800"
                >
                    {value}
                </text>
                <text
                    x={size / 2}
                    y={size / 2 + 18}
                    textAnchor="middle"
                    fill="#7a7468"
                    fontSize="11"
                    fontWeight="500"
                >
                    / {max}
                </text>
            </svg>
            {label && <span className="gauge-label">{label}</span>}
        </div>
    );
}
