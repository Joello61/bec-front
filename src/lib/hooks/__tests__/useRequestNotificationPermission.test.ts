import { describe, expect, it, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

import { useRequestNotificationPermission } from '../useRequestNotificationPermission';

describe('useRequestNotificationPermission - interaction avec l\'API Notification du navigateur', () => {
  const originalNotification = (globalThis as { Notification?: unknown }).Notification;

  afterEach(() => {
    (globalThis as { Notification?: unknown }).Notification = originalNotification;
    vi.restoreAllMocks();
  });

  it('renvoie "denied" si l\'API Notification n\'existe pas dans ce navigateur', async () => {
    delete (globalThis as { Notification?: unknown }).Notification;
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useRequestNotificationPermission());

    await waitFor(() => expect(result.current).toBe('denied'));
  });

  it('demande la permission si le statut actuel est "default" et adopte le resultat', async () => {
    const requestPermission = vi.fn().mockResolvedValue('granted');
    (globalThis as { Notification?: unknown }).Notification = { permission: 'default', requestPermission };

    const { result } = renderHook(() => useRequestNotificationPermission());

    await waitFor(() => expect(result.current).toBe('granted'));
    expect(requestPermission).toHaveBeenCalledTimes(1);
  });

  it('ne redemande pas la permission si elle est deja accordee ou refusee', () => {
    const requestPermission = vi.fn();
    (globalThis as { Notification?: unknown }).Notification = { permission: 'granted', requestPermission };

    const { result } = renderHook(() => useRequestNotificationPermission());

    expect(result.current).toBe('granted');
    expect(requestPermission).not.toHaveBeenCalled();
  });

  it('adopte "denied" si la demande de permission echoue', async () => {
    const requestPermission = vi.fn().mockRejectedValue(new Error('bloque par le navigateur'));
    (globalThis as { Notification?: unknown }).Notification = { permission: 'default', requestPermission };
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useRequestNotificationPermission());

    await waitFor(() => expect(result.current).toBe('denied'));
  });
});
