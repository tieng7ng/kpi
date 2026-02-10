/**
 * Génère un UUID v4 de manière compatible avec tous les environnements
 */
export function generateUUID(): string {
    // Utiliser crypto.randomUUID si disponible
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    // Fallback: générer un UUID v4 manuellement
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
