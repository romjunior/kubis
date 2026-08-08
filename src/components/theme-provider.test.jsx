import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider, useTheme } from '@/components/theme-provider';

function ThemeHarness() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button type="button" onClick={() => setTheme('dark')}>Usar escuro</button>
    </div>
  );
}

function SystemThemeProbe() {
  const { theme } = useTheme();
  useEffect(() => {}, [theme]);
  return <span>{theme}</span>;
}

describe('ThemeProvider', () => {
  it('alterna o tema e persiste a escolha', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><ThemeHarness /></ThemeProvider>);

    await user.click(screen.getByRole('button', { name: 'Usar escuro' }));

    expect(document.documentElement).toHaveClass('dark');
    expect(window.localStorage.getItem('kubis-ui-theme')).toBe('dark');
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('respeita o tema escuro do sistema como padrão', async () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(<ThemeProvider defaultTheme="system"><SystemThemeProbe /></ThemeProvider>);

    await waitFor(() => expect(document.documentElement).toHaveClass('dark'));
    expect(screen.getByText('system')).toBeInTheDocument();
    expect(window.localStorage.getItem('kubis-ui-theme')).toBeNull();
  });
});
