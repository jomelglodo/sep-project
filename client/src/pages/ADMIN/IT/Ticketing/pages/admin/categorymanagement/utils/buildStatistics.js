export default function buildStatistics(categoryConfig, categoryData) {
  return Object.entries(categoryConfig).map(([key, config]) => ({
    key,
    label: config.plural,
    icon: config.icon,
    statisticsLabel: config.statisticsLabel,
    count: categoryData[key]?.length ?? 0,
  }));
}
