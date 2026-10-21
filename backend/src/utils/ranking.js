export function rankProjectBids(bids, designers) {
  if (!bids || bids.length === 0) return [];

  const designerMap = new Map();
  designers.forEach((d) => designerMap.set(d.id, d));

  const valid = bids
    .map((b) => ({ bid: b, designer: designerMap.get(b.d) }))
    .filter((item) => !!item.designer);

  if (valid.length === 0) return [];

  const minPrice = Math.min(...valid.map((v) => v.bid.amount));
  const minDays = Math.min(...valid.map((v) => v.bid.days));

  const sorted = [...valid].sort((a, b) => {
    // 1. Lowest price
    if (a.bid.amount !== b.bid.amount) {
      return a.bid.amount - b.bid.amount;
    }
    // 2. Faster delivery
    if (a.bid.days !== b.bid.days) {
      return a.bid.days - b.bid.days;
    }
    // 3. Higher rating
    if (b.designer.rating !== a.designer.rating) {
      return b.designer.rating - a.designer.rating;
    }
    // 4. Lower current workload
    if (a.designer.load !== b.designer.load) {
      return a.designer.load - b.designer.load;
    }
    // 5. Earlier submission
    return a.bid.at - b.bid.at;
  });

  return sorted.map((item, idx) => ({
    bid: item.bid,
    designer: item.designer,
    rank: idx + 1,
    isLowestPrice: item.bid.amount === minPrice,
    isFastestDelivery: item.bid.days === minDays,
    score: Math.max(0, 100 - idx * 10),
  }));
}
