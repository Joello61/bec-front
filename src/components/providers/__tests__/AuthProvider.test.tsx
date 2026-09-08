import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../AuthProvider';

const mockFetchMe = vi.fn();
vi.mock('@/lib/store', () => ({
  useAuthStore: (selector: (state: { fetchMe: typeof mockFetchMe }) => unknown) => selector({ fetchMe: mockFetchMe }),
}));

describe('AuthProvider - logique metier', () => {
  it("declenche fetchMe au montage pour recuperer l'utilisateur courant", () => {
    render(
      <AuthProvider>
        <div>Contenu enfant</div>
      </AuthProvider>
    );
    expect(mockFetchMe).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Contenu enfant')).toBeInTheDocument();
  });
});
