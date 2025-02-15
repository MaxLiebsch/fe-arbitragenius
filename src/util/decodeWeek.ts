export function decodeWeek(searchParams: URLSearchParams): {
  start: string;
  end: string;
} | null {
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return null;
  }

  if (start > end) {
    return {
      start: new Date(parseInt(end)).toISOString(),
      end: new Date(parseInt(start)).toISOString(),
    };
  }

  return {
    start: new Date(parseInt(start)).toISOString(),
    end: new Date(parseInt(end)).toISOString(),
  };
}
