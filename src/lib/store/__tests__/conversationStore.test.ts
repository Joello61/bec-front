import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ApiError, ConversationDetail } from '@/types';

vi.mock('@/lib/api/conversations', () => ({
  conversationsApi: {
    list: vi.fn(),
    markAsRead: vi.fn(),
    getUnreadCount: vi.fn(),
  },
}));
vi.mock('@/lib/api/messages', () => ({
  messagesApi: {
    send: vi.fn(),
  },
}));

import { conversationsApi } from '@/lib/api/conversations';
import { messagesApi } from '@/lib/api/messages';
import { useConversationStore } from '../conversationStore';

const initialState = useConversationStore.getState();

beforeEach(() => {
  useConversationStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('conversationStore.markAsRead', () => {
  it('ne touche pas isLoading, meme en cas de succes (comportement d\'origine)', async () => {
    useConversationStore.setState({
      currentConversation: { id: 1, messages: [{ id: 1, lu: false }] } as unknown as ConversationDetail,
    });
    vi.mocked(conversationsApi.markAsRead).mockResolvedValue({ count: 0 });
    vi.mocked(conversationsApi.getUnreadCount).mockResolvedValue(0);
    vi.mocked(conversationsApi.list).mockResolvedValue([]);

    await useConversationStore.getState().markAsRead(1);

    expect(useConversationStore.getState().isLoading).toBe(false);
    expect((useConversationStore.getState().currentConversation as unknown as { messages: { lu: boolean }[] }).messages[0].lu).toBe(true);
  });

  it('absorbe l\'erreur sans relancer, sans toucher isLoading', async () => {
    vi.mocked(conversationsApi.markAsRead).mockRejectedValue({ success: false, message: 'Erreur' } as ApiError);

    await expect(useConversationStore.getState().markAsRead(1)).resolves.toBeUndefined();

    expect(useConversationStore.getState()).toMatchObject({ isLoading: false, error: 'Erreur' });
  });
});

describe('conversationStore.sendMessage', () => {
  it('ajoute le message a la conversation courante et rafraichit la liste (fire-and-forget)', async () => {
    useConversationStore.setState({
      currentConversation: { id: 1, messages: [] } as unknown as ConversationDetail,
    });
    vi.mocked(messagesApi.send).mockResolvedValue({ id: 99 } as never);
    vi.mocked(conversationsApi.list).mockResolvedValue([]);

    await useConversationStore.getState().sendMessage({} as never);

    expect((useConversationStore.getState().currentConversation as unknown as { messages: { id: number }[] }).messages).toEqual([{ id: 99 }]);
  });
});
