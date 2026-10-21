export function rankBids(p, designers, mode = 'live') {
    const bids = mode === 'none' ? [] : p.bids.map((b) => ({ ...b }));
    const dm = (id) => designers.find((d) => d.id === id);
    const rows = bids.map((b) => {
        const d = dm(b.d) || {
            id: b.d,
            name: 'Unknown Designer',
            ini: '??',
            email: '',
            phone: '',
            skills: [],
            rating: 0,
            active: true,
            limit: 1,
            load: 0,
            joined: '',
            earned: 0,
            bids: 0,
            won: 0,
            portfolio: '',
        };
        const load = mode === 'inelig' ? d.limit : d.load;
        const reasons = [];
        if (!d.active)
            reasons.push('Account inactive');
        if (d.rating < p.minRating)
            reasons.push('Rating ' + d.rating.toFixed(1) + ' is below ' + p.minRating.toFixed(1));
        if (load >= d.limit && p.awardedTo !== d.id)
            reasons.push('At project limit (' + load + ' / ' + d.limit + ')');
        if (b.amount > p.max)
            reasons.push('Above the maximum');
        return {
            b: b,
            d: d,
            load: load,
            amount: b.amount,
            elig: reasons.length === 0,
            reason: reasons.length ? reasons.join(' · ') : 'Meets all rules',
        };
    });
    const sorter = (a, b) => a.amount - b.amount || b.d.rating - a.d.rating || a.b.at - b.b.at;
    if (mode === 'tie') {
        const el = rows.filter((r) => r.elig).sort(sorter);
        if (el.length > 1) {
            el[1].amount = el[0].amount;
        }
    }
    rows.sort(sorter);
    const lowest = rows.find((r) => r.elig) || null;
    const ties = lowest ? rows.filter((r) => r.elig && r.amount === lowest.amount) : [];
    return { rows, lowest, tie: ties.length > 1, ties };
}
