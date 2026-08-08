import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from '@/App';
import { ThemeProvider } from '@/components/theme-provider';

function renderApp() {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  );
}

describe('Dashboard', () => {
  it('renderiza o resumo e as atividades do workspace', () => {
    renderApp();

    expect(screen.getByRole('heading', { name: /bom dia, romualdo/i })).toBeInTheDocument();
    expect(screen.getByText('Projetos ativos')).toBeInTheDocument();
    expect(screen.getByText('Atividade recente')).toBeInTheDocument();
    expect(screen.getByLabelText('Buscar')).toBeInTheDocument();
  });

  it('abre a navegação compacta pelo botão de menu', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));

    expect(await screen.findByRole('dialog', { name: 'Menu principal' })).toBeInTheDocument();
  });
});
