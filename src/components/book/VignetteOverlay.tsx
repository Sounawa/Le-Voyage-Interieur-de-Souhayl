'use client';

export default function VignetteOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2]"
      style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.8) 100%)',
      }}
    />
  );
}
