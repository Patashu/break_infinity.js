function createZeroes(count: number): string {
  let result = "";
  while (result.length < count) {
    result += "0";
  }

  return result;
}

const cache: string[] = [];

export function repeatZeroes(count: number): string {
  if (count <= 0) {
    return "";
  }

  const cached = cache[count];
  if (cached !== undefined) {
    return cached;
  }

  const computed = createZeroes(count);
  cache[count] = computed;
  return computed;
}

export function trailZeroes(places: number): string {
  return places > 0 ? "." + repeatZeroes(places) : "";
}