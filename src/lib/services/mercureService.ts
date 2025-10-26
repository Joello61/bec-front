/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "../api/client";
import { EventTypeValue } from "../utils/eventType";

class MercureService {
  private eventSource: EventSource | null = null;
  private topics: Set<string> = new Set();
  private eventListeners: Map<string, ((data: any) => void)[]> = new Map();
  private prefixListeners: Map<string, ((eventType: string, data: any) => void)[]> = new Map();
  private anyListeners: ((eventType: string, data: any) => void)[] = [];

  private readonly MERCURE_HUB_URL = process.env.NEXT_PUBLIC_MERCURE_HUB_URL;

  private isRefreshing = false;
  private refreshAttemptCount = 0;
  private readonly MAX_REFRESH_ATTEMPTS = 3;

  public connect(): void {
    if (this.eventSource || !this.MERCURE_HUB_URL) return;

    const url = new URL(this.MERCURE_HUB_URL);
    this.topics.forEach((topic) => url.searchParams.append('topic', topic));

    console.log('[Mercure] Tentative de connexion EventSource...');
    this.eventSource = new EventSource(url.toString(), { withCredentials: true });

    this.eventSource.onopen = () => {
      console.log('[Mercure] Connexion EventSource ouverte.');
      this.refreshAttemptCount = 0;
    };

    this.eventSource.onmessage = (event) => {
      try {
        const eventData = JSON.parse(event.data);
        const { eventType, data } = eventData;
        if (!eventType) return;
        this.eventListeners.get(eventType)?.forEach((cb) => cb(data));
        this.prefixListeners.forEach((listeners, prefix) => {
          if (eventType.startsWith(prefix)) {
            listeners.forEach((cb) => cb(eventType, data));
          }
        });
        this.anyListeners.forEach((cb) => cb(eventType, data));
      } catch (e) {
        console.error('Erreur de parsing Mercure:', e);
      }
    };
    this.eventSource.onerror = (err) => {
      console.error('Erreur EventSource Mercure:', err);
      if (this.eventSource?.readyState === EventSource.CLOSED) {
        console.warn(
          '[Mercure] EventSource fermé. Tentative de rafraîchissement du token...'
        );
        this.attemptMercureTokenRefresh();
      } else {
        console.log(
          '[Mercure] Erreur détectée (readyState:',
          this.eventSource?.readyState,
          '). Attente de reconnexion auto...'
        );
      }
    };
  }

  private async attemptMercureTokenRefresh(): Promise<void> {
    if (this.isRefreshing || this.refreshAttemptCount >= this.MAX_REFRESH_ATTEMPTS) {
      if (this.refreshAttemptCount >= this.MAX_REFRESH_ATTEMPTS) {
        console.error(
          '[Mercure] Nombre maximum de tentatives de rafraîchissement atteint. Abandon.'
        );
        this.disconnect();
      }
      return;
    }

    this.isRefreshing = true;
    this.refreshAttemptCount++;
    console.log(
      `[Mercure] Tentative de rafraîchissement du cookie Mercure #${this.refreshAttemptCount}...`
    );

    try {
      await apiClient.post('/token/mercure/refresh');

      console.log(
        '[Mercure] Cookie Mercure rafraîchi avec succès. Reconnexion...'
      );
      this.reconnect();

    } catch (error) {
      console.error(
        '[Mercure] Échec de la demande de rafraîchissement du cookie Mercure:',
        error
      );
      this.disconnect();
    } finally {
      this.isRefreshing = false;
    }
  }

  public disconnect(): void {
    this.eventSource?.close();
    this.eventSource = null;
    this.topics.clear();
    this.eventListeners.clear();
    this.prefixListeners.clear();
    this.anyListeners = [];
  }

  public on(eventType: EventTypeValue, callback: (data: any) => void): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);

    return () => {
      const list = this.eventListeners.get(eventType);
      if (list) this.eventListeners.set(eventType, list.filter((cb) => cb !== callback));
    };
  }

  public onPrefix(prefix: string, callback: (eventType: string, data: any) => void): () => void {
    if (!this.prefixListeners.has(prefix)) {
      this.prefixListeners.set(prefix, []);
    }
    this.prefixListeners.get(prefix)!.push(callback);

    return () => {
      const list = this.prefixListeners.get(prefix);
      if (list) this.prefixListeners.set(prefix, list.filter((cb) => cb !== callback));
    };
  }

  public onAny(callback: (eventType: string, data: any) => void): () => void {
    this.anyListeners.push(callback);
    return () => {
      this.anyListeners = this.anyListeners.filter((cb) => cb !== callback);
    };
  }

  public addTopic(topic: string): void {
    if (!this.topics.has(topic)) {
      this.topics.add(topic);
      this.reconnect();
    }
  }

  public removeTopic(topic: string): void {
    if (this.topics.has(topic)) {
      this.topics.delete(topic);
      this.reconnect();
    }
  }

  private reconnect(): void {
    this.eventSource?.close();
    this.eventSource = null;
    setTimeout(() => this.connect(), 500);
  }
}

export const mercureService = new MercureService();