export const formatDate = (value: string | null) => {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
