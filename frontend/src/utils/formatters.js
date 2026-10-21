export const H = 3600000;
export const D = 86400000;
export const MN = 60000;
export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const FDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const MONS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const FMONS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const ST = {
    draft: ['Draft', 'bdg b-dash'],
    open: ['Open', 'bdg b-out'],
    closed: ['Closed', 'bdg b-grey'],
    awarded: ['Awarded', 'bdg b-fill'],
    progress: ['In progress', 'bdg b-out b-dot'],
    review: ['In review', 'bdg b-grey b-dot'],
    completed: ['Completed', 'bdg b-fill'],
};
export const TL = [
    ['draft', 'Draft'],
    ['open', 'Open'],
    ['closed', 'Closed'],
    ['awarded', 'Awarded'],
    ['progress', 'In progress'],
    ['review', 'In review'],
    ['completed', 'Completed'],
];
export const AWARDED = ['awarded', 'progress', 'review', 'completed'];
export const VCLS = {
    'In review': 'bdg b-grey b-dot',
    'Revision requested': 'bdg b-dash',
    Approved: 'bdg b-fill',
};
export const REF_SAMPLES = [
    { name: 'Spa_logo_pack.zip', size: '3.2 MB' },
    { name: 'Treatment_menu_copy.docx', size: '48 KB' },
    { name: 'Interior_photos.zip', size: '36.5 MB' },
    { name: 'Brochure_references.pdf', size: '5.1 MB' },
];
export const CLIENT_SAMPLES = [
    { name: 'Client_price_list_2026.xlsx', size: '32 KB' },
    { name: 'Client_brand_fonts.zip', size: '1.4 MB' },
    { name: 'Client_photography.zip', size: '52.0 MB' },
];
export const WORK_SAMPLES = [
    ['Final_artwork', 'pdf', '8.6 MB'],
    ['Mockups', 'png', '2.1 MB'],
    ['Print_ready', 'pdf', '12.4 MB'],
    ['Source_files', 'zip', '64.0 MB'],
];
export const SKILLS = [
    'Branding',
    'Logo design',
    'Packaging',
    'Print',
    'Typography',
    'Layout',
    'Illustration',
    'Social media',
    'UI/UX',
    'Web design',
    'Motion',
];
export const TEMP_PW = ['EVO-7Q4M-28', 'EVO-K2RX-51', 'EVO-9TLD-06', 'EVO-3HWP-74'];
export const FLOW = [
    ['Admin posts a project', 'Admin'],
    ['Designer places a sealed bid', 'Designer'],
    ['Bidding closes', 'Admin'],
    ['Admin awards the lowest eligible bid', 'Admin'],
    ['Designer delivers files', 'Designer'],
    ['Admin approves', 'Admin'],
];
export function money(n) {
    return 'LKR ' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
export function p2(n) {
    return String(n).padStart(2, '0');
}
export function ftime(t) {
    const d = new Date(t);
    let h = d.getHours();
    const ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + p2(d.getMinutes()) + ' ' + ap;
}
export function fdate(t) {
    const d = new Date(t);
    return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONS[d.getMonth()] + ' ' + d.getFullYear();
}
export function fshort(t) {
    const d = new Date(t);
    return d.getDate() + ' ' + MONS[d.getMonth()];
}
export function fdt(t) {
    return fshort(t) + ', ' + ftime(t);
}
export function ago(t, now) {
    const ms = now - t;
    if (ms < MN)
        return 'Just now';
    if (ms < H)
        return Math.floor(ms / MN) + ' min ago';
    if (ms < D)
        return Math.floor(ms / H) + ' h ago';
    const d = Math.floor(ms / D);
    return d === 1 ? 'Yesterday' : d + ' days ago';
}
export function cdown(close, now) {
    const ms = close - now;
    if (ms <= 0)
        return { text: 'Closed', soon: false, closed: true };
    const d = Math.floor(ms / D);
    const h = Math.floor((ms % D) / H);
    const m = Math.floor((ms % H) / MN);
    const s = Math.floor((ms % MN) / 1000);
    const text = d > 0
        ? d + 'd ' + p2(h) + 'h ' + p2(m) + 'm'
        : h > 0
            ? h + 'h ' + p2(m) + 'm ' + p2(s) + 's'
            : p2(m) + 'm ' + p2(s) + 's';
    return { text: text, soon: ms < H, closed: false };
}
export function localStr(t) {
    const d = new Date(t);
    return (d.getFullYear() +
        '-' +
        p2(d.getMonth() + 1) +
        '-' +
        p2(d.getDate()) +
        'T' +
        p2(d.getHours()) +
        ':' +
        p2(d.getMinutes()));
}
export function first(name) {
    return String(name || '').split(' ')[0];
}
export function tlFor(status) {
    const idx = TL.findIndex((x) => x[0] === status);
    return TL.map((x, i) => {
        const done = i < idx || (status === 'completed' && i === idx);
        return {
            label: x[1],
            done: done,
            cls: done ? 'tl-done' : i === idx ? 'tl-cur' : '',
        };
    });
}
