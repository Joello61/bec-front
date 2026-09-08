import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BottomNavBar, { type BottomNavItem } from '../BottomNavBar';
import { Search, Plus } from 'lucide-react';

describe('BottomNavBar - logique metier', () => {
  it('affiche le badge avec le compte exact sous 10', () => {
    const navigation: BottomNavItem[] = [{ name: 'Messages', href: '/messages', icon: Search, badge: 3 }];
    render(<BottomNavBar navigation={navigation} isActive={() => false} onNavigate={vi.fn()} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('plafonne le badge a "9+" au-dela de 9', () => {
    const navigation: BottomNavItem[] = [{ name: 'Messages', href: '/messages', icon: Search, badge: 15 }];
    render(<BottomNavBar navigation={navigation} isActive={() => false} onNavigate={vi.fn()} />);
    expect(screen.getByText('9+')).toBeInTheDocument();
  });

  it("n'affiche pas de badge quand il vaut 0", () => {
    const navigation: BottomNavItem[] = [{ name: 'Messages', href: '/messages', icon: Search, badge: 0 }];
    render(<BottomNavBar navigation={navigation} isActive={() => false} onNavigate={vi.fn()} />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('appelle onNavigate au clic sur un item avec href', async () => {
    const onNavigate = vi.fn();
    const navigation: BottomNavItem[] = [{ name: 'Explorer', href: '/explore', icon: Search }];
    const user = userEvent.setup();
    render(<BottomNavBar navigation={navigation} isActive={() => false} onNavigate={onNavigate} />);

    await user.click(screen.getByText('Explorer'));
    expect(onNavigate).toHaveBeenCalledWith('/explore');
  });

  it('appelle action (pas onNavigate) au clic sur un item central sans href', async () => {
    const onNavigate = vi.fn();
    const action = vi.fn();
    const navigation: BottomNavItem[] = [{ name: 'Créer', icon: Plus, action, isCenter: true }];
    const user = userEvent.setup();
    render(<BottomNavBar navigation={navigation} isActive={() => false} onNavigate={onNavigate} />);

    await user.click(screen.getByRole('button'));
    expect(action).toHaveBeenCalledTimes(1);
    expect(onNavigate).not.toHaveBeenCalled();
  });
});
