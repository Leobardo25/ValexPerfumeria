import { createContext, useContext, useState, useEffect } from 'react';
import { subscribeSiteConfig } from '../services/siteConfigService';
import { BRAND } from '../constants';

const DEFAULTS = {
    whatsapp: '50687329055',
    instagram: 'https://www.instagram.com/valex.perfumeria?utm_source=qr&igsh=cDZ5YnBka241N2hv',
    facebook: 'https://www.facebook.com/profile.php?id=61574248779040',
    tiktok: 'https://www.tiktok.com/@valexperfum?_r=1&_t=ZS-95NmVfGvOvE',
    brandName: BRAND.name,
    brandTagline: BRAND.tagline,
    storeCurrency: 'CRC',
};

const SiteConfigContext = createContext(DEFAULTS);

export function SiteConfigProvider({ children }) {
    const [config, setConfig] = useState(DEFAULTS);

    useEffect(() => {
        const unsub = subscribeSiteConfig('global', (data) => {
            if (data) setConfig({ ...DEFAULTS, ...data });
        });
        return unsub;
    }, []);

    return (
        <SiteConfigContext.Provider value={config}>
            {children}
        </SiteConfigContext.Provider>
    );
}

export const useSiteConfig = () => useContext(SiteConfigContext);
