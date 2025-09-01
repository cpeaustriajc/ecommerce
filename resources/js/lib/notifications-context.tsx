import * as React from 'react';

export type ItemNotification = {
    id: number;
    item: { id: number; name: string };
    message: string;
    created_at: string;
    hasUnread: boolean;
};

interface NotificationsContextValue {
    notifications: ItemNotification[];
    unreadCount: number;
    add: (n: ItemNotification) => void;
    markAllRead: () => void;
    markRead: (id: number) => void;
}

const NotificationsContext = React.createContext<NotificationsContextValue | undefined>(undefined);

type ProviderProps = { children: React.ReactNode; storageKey?: string };

export function NotificationsProvider({ children, storageKey }: ProviderProps) {
    const [notifications, setNotifications] = React.useState<ItemNotification[]>(() => {
        if (typeof window === 'undefined' || !storageKey) {
            return [];
        }
        try {
            const raw = window.localStorage.getItem(storageKey);
            if (!raw) return [];
            const parsed = JSON.parse(raw) as ItemNotification[];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });

    const add = React.useCallback((n: ItemNotification) => {
        setNotifications((prev) => [n, ...prev]);
    }, []);

    const markAllRead = React.useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, hasUnread: false })));
    }, []);

    const markRead = React.useCallback((id: number) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, hasUnread: false } : n)));
    }, []);

    const unreadCount = React.useMemo(() => notifications.filter((n) => n.hasUnread).length, [notifications]);

    React.useEffect(() => {
        if (typeof window === 'undefined' || !storageKey) {
            return;
        }
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(notifications));
        } catch {
            // ignore write errors
        }
    }, [notifications, storageKey]);

    const value = React.useMemo(
        () => ({ notifications, unreadCount, add, markAllRead, markRead }),
        [notifications, unreadCount, add, markAllRead, markRead],
    );

    return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
    const ctx = React.useContext(NotificationsContext);
    if (!ctx) {
        throw new Error('useNotifications must be used within NotificationsProvider');
    }
    return ctx;
}
