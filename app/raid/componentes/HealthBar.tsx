"use client";

interface HealthBarProps {
  current: number;
  max: number;
}

const HealthBar = ({ current, max }: HealthBarProps) => {
  const percent = Math.max((current / max) * 100, 0);

  return (
    <div className="w-[65%]">
      <p className="text-sm mb-1">
        HP: {current}/{max}
      </p>
      <div className="w-full h-3 bg-gray-700 rounded">
        <div
          className="h-3 bg-red-600 rounded transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default HealthBar;
