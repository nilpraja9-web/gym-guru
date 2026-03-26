import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';

const goalOptions = [
  { value: 'bulk', label: 'Build Muscle' },
  { value: 'cut', label: 'Fat Loss' },
  { value: 'recomp', label: 'Body Recomposition' },
  { value: 'strength', label: 'Build Strength' },
  { value: 'endurance', label: 'Improve Endurance' },
];

const daysOptions = [
  { value: '1', label: '1 day / week' },
  { value: '2', label: '2 days/ week' },
  { value: '3', label: '3 days/ week' },
  { value: '4', label: '4 days/ week' },
  { value: '5', label: '5 days/ week' },
  { value: '6', label: '6 days/ week' },
];

interface DemoProps {
  className?: string;
}

export function Demo({ className }: DemoProps) {
  const [goal, setGoal] = useState('bulk');
  const [days, setDays] = useState('4');

  return (
    <div className={className}>
      <div className="text-left space-y-6 ">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between min-h-[100px]">
            <div className="text-xs text-[var(--color-muted)] mb-2 uppercase tracking-wider">Goal</div>
            <Select
              options={goalOptions}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="bg-transparent border-none p-0 h-auto font-bold text-lg focus:ring-0 text-[var(--color-accent)] cursor-pointer"
            />
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between min-h-[100px]">
            <div className="text-xs text-[var(--color-muted)] mb-2 uppercase tracking-wider">Frequency</div>
            <Select
            
              options={daysOptions}
              value={days}
              onChange={(e) => setDays(e.target.value)}
              
              className="bg-transparent border-none p-0 h-auto font-bold text-lg focus:ring-0 text-[var(--color-accent)] cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 rounded-lg glass border border-white/5">
            <span className="font-medium text-[var(--color-accent)]">1. Barbell Squats</span>
            <span className="text-[var(--color-accent)] font-mono">3 x 8-10</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg glass border border-white/5">
            <span className="font-medium text-[var(--color-accent)]">2. Bench Press</span>
            <span className="text-[var(--color-accent)] font-mono">3 x 8-10</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg glass border border-white/5 opacity-50">
            <span className="font-medium text-[var(--color-muted)]">+ 4 more exercises</span>
          </div>
        </div>
      </div>

      <Link to="/onboarding" className="block mt-8">
        <Button size="lg" className="w-full h-14 text-lg">
          Get Your Full Plan
        </Button>
      </Link>
    </div>
  );
}
