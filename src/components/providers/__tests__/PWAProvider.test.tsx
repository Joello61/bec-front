import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import PWAProvider, { ConnectionIndicator } from '../PWAProvider';

const mockRegisterServiceWorker = vi.fn();
const mockGetServiceWorkerVersion = vi.fn();
let mockIsOnline = true;
let connectionChangeCallback: ((online: boolean) => void) | null = null;

vi.mock('@/lib/utils/pwa/registerSW', () => ({
  registerServiceWorker: () => mockRegisterServiceWorker(),
  getServiceWorkerVersion: () => mockGetServiceWorkerVersion(),
  isPWAInstalled: () => false,
  isOnline: () => mockIsOnline,
  onConnectionChange: (cb: (online: boolean) => void) => {
    connectionChangeCallback = cb;
    return () => { connectionChangeCallback = null; };
  },
}));

function mockMatchMedia() {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
}

describe('PWAProvider - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetServiceWorkerVersion.mockResolvedValue(null);
    mockIsOnline = true;
    connectionChangeCallback = null;
    mockMatchMedia();
  });

  it('enregistre le service worker au montage', () => {
    render(<PWAProvider><div>Enfant</div></PWAProvider>);
    expect(mockRegisterServiceWorker).toHaveBeenCalledTimes(1);
  });
});

describe('ConnectionIndicator - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockGetServiceWorkerVersion.mockResolvedValue(null);
    mockIsOnline = true;
    connectionChangeCallback = null;
    mockMatchMedia();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("n'affiche rien tant que la connexion n'a jamais ete perdue", () => {
    render(<ConnectionIndicator />);
    expect(screen.queryByText(/mode hors ligne/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/connexion rétablie/i)).not.toBeInTheDocument();
  });

  it('affiche immediatement "Mode hors ligne" au passage hors-ligne', () => {
    render(<ConnectionIndicator />);

    mockIsOnline = false;
    act(() => connectionChangeCallback?.(false));

    expect(screen.getByText(/mode hors ligne/i)).toBeInTheDocument();
  });

  it('affiche "Connexion retablie" puis se masque apres 2 secondes au retour en ligne', () => {
    render(<ConnectionIndicator />);

    mockIsOnline = false;
    act(() => connectionChangeCallback?.(false));
    mockIsOnline = true;
    act(() => connectionChangeCallback?.(true));

    expect(screen.getByText(/connexion rétablie/i)).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(2000));
    expect(screen.queryByText(/connexion rétablie/i)).not.toBeInTheDocument();
  });
});
