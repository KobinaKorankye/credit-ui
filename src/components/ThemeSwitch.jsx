import { useTheme } from '../contexts/ThemeContext';
import { BsSun, BsMoon } from 'react-icons/bs';

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'transflow-light', label: 'Light' },
    { value: 'transflow-dark', label: 'Dark' },
    { value: 'light', label: 'Default Light' },
    { value: 'dark', label: 'Default Dark' },
  ];

  return (
    <div className="flex items-center gap-2">
      <BsSun className="h-4 w-4 text-muted-foreground" />
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="flex h-8 w-auto rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {themes.map((themeOption) => (
          <option key={themeOption.value} value={themeOption.value}>
            {themeOption.label}
          </option>
        ))}
      </select>
      <BsMoon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}
