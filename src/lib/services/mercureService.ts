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
  private readonly isDev = process.env.NODE_ENV !== "production";

  private isRefreshing = false;
  private refreshAttemptCount = 0;
  private readonly MAX_REFRESH_ATTEMPTS = 3;

  public connect(): void {
    if (this.eventSource || !this.MERCURE_HUB_URL) return;

    const url = new URL(this.MERCURE_HUB_URL);
    this.topics.forEach((topic) => url.searchParams.append("topic", topic));

    this.log("Connexion Mercure…");
    this.eventSource = new EventSource(url.toString(), { withCredentials: true });

    this.eventSource.onopen = () => {
      this.log("Connexion Mercure ouverte");
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
      } catch {
        this.log("Erreur de parsing Mercure", true);
      }
    };

    this.eventSource.onerror = () => {
      if (this.eventSource?.readyState === EventSource.CLOSED) {
        this.log("Connexion Mercure fermée. Tentative de rafraîchissement…", true);
        this.attemptMercureTokenRefresh();
      } else {
        this.log("Erreur EventSource (reconnexion auto…)", true);
      }
    };
  }

  private async attemptMercureTokenRefresh(): Promise<void> {
    if (this.isRefreshing || this.refreshAttemptCount >= this.MAX_REFRESH_ATTEMPTS) {
      if (this.refreshAttemptCount >= this.MAX_REFRESH_ATTEMPTS) {
        this.log("Tentatives de rafraîchissement épuisées — déconnexion.", true);
        this.disconnect();
      }
      return;
    }

    this.isRefreshing = true;
    this.refreshAttemptCount++;

    try {
      await apiClient.post("/token/mercure/refresh");
      this.log("Cookie Mercure rafraîchi avec succès.");
      this.reconnect();
    } catch {
      this.log("Échec du rafraîchissement du cookie Mercure.", true);
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

  /** Log utile en dev uniquement */
  private log(message: string, isError = false): void {
    if (this.isDev) {
      if (isError) console.warn(`[Mercure] ${message}`);
      else console.log(`[Mercure] ${message}`);
    }
  }
}

export const mercureService = new MercureService();
