const API_URL = 'https://apiadmin.bmdrm.com/api/public/docs/tree';

(async () => {
    try {
        const res = await fetch(API_URL);
        console.log('Status:', res.status);
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Fetch error:', e);
    }
})();
