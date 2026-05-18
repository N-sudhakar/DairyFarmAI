import { useState, useEffect, useRef } from 'react';

export default function AnimatedNumber({ value, duration = 1200, decimals = 0, prefix = '', suffix = '' }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef(null);
    const startTime = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) {
            setDisplay(value);
            return;
        }
        hasAnimated.current = true;

        const animate = (timestamp) => {
            if (!startTime.current) startTime.current = timestamp;
            const progress = Math.min((timestamp - startTime.current) / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * value;

            setDisplay(current);

            if (progress < 1) {
                ref.current = requestAnimationFrame(animate);
            } else {
                setDisplay(value);
            }
        };

        ref.current = requestAnimationFrame(animate);

        return () => {
            if (ref.current) cancelAnimationFrame(ref.current);
        };
    }, [value, duration]);

    const formatted = decimals > 0
        ? display.toFixed(decimals)
        : Math.round(display).toLocaleString();

    return (
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            {prefix}{formatted}{suffix}
        </span>
    );
}
