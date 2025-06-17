import { useEffect } from 'react';

interface CalendlyEmbedProps {
  url: string;
  height?: string;
  onEventScheduled?: (event: any) => void;
}

export default function CalendlyEmbed({
  url,
  height = '600px',
  onEventScheduled,
}: CalendlyEmbedProps) {
  useEffect(() => {
    // Load Calendly embed script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    // Listen for Calendly events
    const handleCalendlyEvent = (event: MessageEvent) => {
      if (event.origin !== 'https://calendly.com') return;

      if (event.data.event && event.data.event === 'calendly.event_scheduled') {
        onEventScheduled?.(event.data.payload);
      }
    };

    window.addEventListener('message', handleCalendlyEvent);

    return () => {
      window.removeEventListener('message', handleCalendlyEvent);
      // Clean up script
      const existingScript = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]',
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [onEventScheduled]);

  return (
    <div
      className="calendly-inline-widget"
      data-url={url}
      style={{ minWidth: '320px', height }}
    />
  );
}

// Component for a simple Calendly popup button
interface CalendlyPopupButtonProps {
  url: string;
  text: string;
  className?: string;
  onEventScheduled?: (event: any) => void;
}

export function CalendlyPopupButton({
  url,
  text,
  className = '',
  onEventScheduled,
}: CalendlyPopupButtonProps) {
  useEffect(() => {
    // Load Calendly popup script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    // Listen for Calendly events
    const handleCalendlyEvent = (event: MessageEvent) => {
      if (event.origin !== 'https://calendly.com') return;

      if (event.data.event && event.data.event === 'calendly.event_scheduled') {
        onEventScheduled?.(event.data.payload);
      }
    };

    window.addEventListener('message', handleCalendlyEvent);

    return () => {
      window.removeEventListener('message', handleCalendlyEvent);
    };
  }, [onEventScheduled]);

  const openCalendlyPopup = () => {
    // @ts-ignore - Calendly global variable
    if (window.Calendly) {
      // @ts-ignore
      window.Calendly.initPopupWidget({ url });
    }
  };

  return (
    <button onClick={openCalendlyPopup} className={className}>
      {text}
    </button>
  );
}
