import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { initializeFheInstance } from '../core/index.js';

interface FhevmContextType {
    instance: any;
    status: 'idle' | 'loading' | 'ready' | 'error';
    error: string;
    initialize: () => Promise<void>;
    isInitialized: boolean;
}

const FhevmContext = createContext<FhevmContextType | undefined>(undefined);

export function FhevmProvider({ children }: { children: ReactNode }) {
    const [instance, setInstance] = useState<any>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
    const [error, setError] = useState<string>('');

    const initialize = useCallback(async () => {
        if (status === 'loading' || status === 'ready') return;

        setStatus('loading');
        setError('');

        try {
            const fheInstance = await initializeFheInstance();
            setInstance(fheInstance);
            setStatus('ready');
            console.log('✅ FHEVM Instance shared via Provider');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setStatus('error');
            console.error('❌ FHEVM Provider initialization failed:', err);
        }
    }, [status]);

    return (
        <FhevmContext.Provider
            value={{
                instance,
                status,
                error,
                initialize,
                isInitialized: status === 'ready'
            }}
        >
            {children}
        </FhevmContext.Provider>
    );
}

export function useFhevmContext() {
    const context = useContext(FhevmContext);
    if (context === undefined) {
        throw new Error('useFhevmContext must be used within a FhevmProvider');
    }
    return context;
}
