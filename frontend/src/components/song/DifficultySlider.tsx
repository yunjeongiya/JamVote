// 난이도 슬라이더 컴포넌트

import { DIFFICULTY_LEVELS } from '../../constants/sessions';

interface DifficultySliderProps {
  session: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function DifficultySlider({ session, value, onChange, disabled }: DifficultySliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-300">{session}</label>
        <span className="text-sm text-gray-400">
          {DIFFICULTY_LEVELS[value as keyof typeof DIFFICULTY_LEVELS]}
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>쉬움</span>
        <span>어려움</span>
      </div>
    </div>
  );
}

