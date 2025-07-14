export const getTierLabel = (tier: number) => {
  switch (tier) {
    case 1:
      return { label: 'S', color: 'yellow' as const };
    case 2:
      return { label: 'A', color: 'purple' as const };
    case 3:
      return { label: 'B', color: 'blue' as const };
    case 4:
      return { label: 'C', color: 'green' as const };
    default:
      return { label: 'Unknown', color: 'gray' as const };
  }
};
