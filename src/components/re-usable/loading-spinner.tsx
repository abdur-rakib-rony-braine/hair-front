export const LoadingSpinner = ({ size = 20, color = "white" }) => {
  const bars = 12;
  const barWidth = size * 0.15;
  const barHeight = size * 0.35;
  const radius = size * 0.35;

  return (
    <div
      className="inline-block relative"
      style={{ width: size, height: size }}
    >
      <style>{`
        @keyframes fade {
          0% { opacity: 1; }
          100% { opacity: 0.15; }
        }
      `}</style>
      {[...Array(bars)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: barWidth,
            height: barHeight,
            backgroundColor: color,
            borderRadius: barWidth,
            left: '50%',
            top: '50%',
            marginLeft: -barWidth / 2,
            marginTop: -barHeight / 2,
            transformOrigin: `50% ${radius}px`,
            transform: `rotate(${i * (360 / bars)}deg)`,
            animation: `fade 1s linear infinite`,
            animationDelay: `${-(bars - i) * (1 / bars)}s`,
            opacity: 0.15,
          }}
        />
      ))}
    </div>
  );
};