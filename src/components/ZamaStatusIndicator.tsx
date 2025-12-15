import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Clock, WifiOff } from 'lucide-react';

interface ZamaStatus {
    aggregate_state: 'operational' | 'degraded' | 'downtime' | 'maintenance';
    updated_at: string;
}

export function ZamaStatusIndicator() {
    const [status, setStatus] = useState<ZamaStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch('https://status.zama.org/index.json', {
                    mode: 'cors',
                    cache: 'no-cache',
                });
                const data = await response.json();
                setStatus({
                    aggregate_state: data.data.attributes.aggregate_state,
                    updated_at: data.data.attributes.updated_at,
                });
                setError(null);
            } catch (err) {
                // Network/CORS error - likely same issue as Gateway
                setError('network');
                console.warn('Zama status fetch blocked (likely network/CORS):', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
        // Refresh every 5 minutes (reduced to minimize CORS errors in production)
        const interval = setInterval(fetchStatus, 300000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 animate-spin" />
                <span>Checking Zama status...</span>
            </div>
        );
    }

    if (error === 'network') {
        return (
            <a
                href="https://status.zama.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 transition-opacity hover:opacity-70"
                title="Click to check Zama status manually"
            >
                <WifiOff className="h-4 w-4" />
                <span>Zama Status (Network Restricted)</span>
            </a>
        );
    }

    if (error || !status) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>Status unavailable</span>
            </div>
        );
    }

    const getStatusDisplay = () => {
        switch (status.aggregate_state) {
            case 'operational':
                return {
                    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
                    text: 'Zama Services Online',
                    className: 'text-green-600 dark:text-green-400',
                };
            case 'degraded':
                return {
                    icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
                    text: 'Zama Services Degraded',
                    className: 'text-yellow-600 dark:text-yellow-400',
                };
            case 'downtime':
            case 'maintenance':
                return {
                    icon: <AlertCircle className="h-4 w-4 text-red-500" />,
                    text: 'Zama Services Offline',
                    className: 'text-red-600 dark:text-red-400',
                };
            default:
                return {
                    icon: <AlertCircle className="h-4 w-4" />,
                    text: 'Zama Status Unknown',
                    className: 'text-muted-foreground',
                };
        }
    };

    const statusDisplay = getStatusDisplay();

    return (
        <a
            href="https://status.zama.org"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 text-sm transition-opacity hover:opacity-70 ${statusDisplay.className}`}
        >
            {statusDisplay.icon}
            <span>{statusDisplay.text}</span>
        </a>
    );
}
