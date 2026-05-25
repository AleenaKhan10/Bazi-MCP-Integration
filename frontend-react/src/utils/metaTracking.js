// utils/metaTracking.js

export function captureFacebookAttribution() {
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    
    if (fbclid) {
      // Standard fbc cookie format: fb.1.<timestamp>.<fbclid>
      const fbc = `fb.1.${Date.now()}.${fbclid}`;
      
      // Set cookie for 90 days, scoped to root domain so it persists across subdomains
      document.cookie = `_fbc=${fbc}; max-age=${60 * 60 * 24 * 90}; path=/; domain=.chimanifestation.com; SameSite=Lax`;
    }
}
  
export function getFacebookCookies() {
    const cookies = document.cookie.split(';').reduce((acc, c) => {
        const [k, v] = c.trim().split('=');
        if (k) acc[k] = v;
        return acc;
    }, {});
    
    return {
        fbp: cookies._fbp || null, // Set automatically by Meta Pixel
        fbc: cookies._fbc || null,
    };
}
