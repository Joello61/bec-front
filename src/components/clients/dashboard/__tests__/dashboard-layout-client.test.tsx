import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import DashboardLayoutClient from '../dashboard-layout-client';

const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

const mockUseAuth = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAuth: () => mockUseAuth(),
}));

const mockUseMercureEvents = vi.fn();
vi.mock('@/lib/hooks/useMercureEvents', () => ({
  useMercureEvents: () => mockUseMercureEvents(),
}));

vi.mock('@/components/layout', () => ({
  Sidebar: () => <div>Sidebar (mock)</div>,
  BottomNav: () => <div>BottomNav (mock)</div>,
}));

vi.mock('@/components/dashboard/VerificationBanner', () => ({
  default: () => <div>VerificationBanner (mock)</div>,
}));

vi.mock('@/components/common/SplashScreen', () => ({
  default: ({ visible }: { visible: boolean }) => (visible ? <div>SplashScreen (mock)</div> : null),
}));

describe('dashboard-layout-client - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('affiche le splash screen tant que la duree minimale n est pas ecoulee, meme une fois authentifie', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isInitialized: true });
    render(
      <DashboardLayoutClient>
        <div>Contenu dashboard</div>
      </DashboardLayoutClient>
    );

    expect(screen.getByText('SplashScreen (mock)')).toBeInTheDocument();
    expect(screen.queryByText('Contenu dashboard')).not.toBeInTheDocument();
  });

  it('affiche le contenu apres la duree minimale du splash screen', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isInitialized: true });
    render(
      <DashboardLayoutClient>
        <div>Contenu dashboard</div>
      </DashboardLayoutClient>
    );

    act(() => vi.advanceTimersByTime(2500));

    expect(screen.queryByText('SplashScreen (mock)')).not.toBeInTheDocument();
    expect(screen.getByText('Contenu dashboard')).toBeInTheDocument();
  });

  it('redirige vers la connexion une fois initialise si non authentifie', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isInitialized: true });
    render(
      <DashboardLayoutClient>
        <div>Contenu dashboard</div>
      </DashboardLayoutClient>
    );

    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining('login'));
  });

  it("ne redirige pas tant que l'authentification n'est pas initialisee", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isInitialized: false });
    render(
      <DashboardLayoutClient>
        <div>Contenu dashboard</div>
      </DashboardLayoutClient>
    );

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('souscrit aux evenements Mercure au montage', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isInitialized: true });
    render(
      <DashboardLayoutClient>
        <div>Contenu dashboard</div>
      </DashboardLayoutClient>
    );
    expect(mockUseMercureEvents).toHaveBeenCalled();
  });
});
