import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 rounded-lg border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#303134] text-[#5f6368] dark:text-[#e8eaed] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] hover:text-[#202124] dark:hover:text-[#ffffff] transition-colors cursor-pointer shrink-0 shadow-xs"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle visual theme"
        >
            {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-500" />
            ) : (
                <Moon className="w-4 h-4 text-[#5f6368] dark:text-[#9aa0a6]" />
            )}
        </Button>
    );
}
