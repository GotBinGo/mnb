export class EnumHelper {
  static idLabelPair<TEnum>(enumO: TEnum): { id: number; label: string }[] {
    return Object.keys(enumO)
      .filter(x => !isNaN(+x))
      .map(x => ({ id: +x, label: enumO[x] as string }));
  }

  static values<TEnum>(enumO: TEnum): number[] {
    return Object.keys(enumO)
      .filter(x => !isNaN(+x))
      .map(x => +x);
  }

  static toFlags(enumValues: number[]): number {
    return enumValues != null && enumValues.length ? enumValues.reduce((acc, x) => acc | x, 0) : undefined;
  }

  static idLabelPairFromValues<TEnum>(enumValues: number[], enumO: TEnum): { id: number; label: string }[] {
    return Object.keys(enumO)
      .filter(x => !isNaN(+x) && enumValues.includes(+x))
      .map(x => ({ id: +x, label: enumO[x] as string }));
  }
}
