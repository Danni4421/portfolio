export const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "Present";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

export const formatDateRange = (
  startDate?: string | null,
  endDate?: string | null,
) => `${formatDate(startDate)} – ${formatDate(endDate)}`;
