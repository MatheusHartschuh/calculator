export function addMemoryValue(memory: number[], value: number): number[] {
  return [...memory, value];
}

export function clearMemory(): number[] {
  return [];
}

export function removeMemoryValue(memory: number[], index: number): number[] {
  return memory.filter((_, itemIndex) => itemIndex !== index);
}

export function getLastMemoryValue(memory: number[]): number | null {
  if (memory.length === 0) {
    return null;
  }

  return memory[memory.length - 1];
}
