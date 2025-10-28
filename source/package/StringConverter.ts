export class StringConverter {
  public static isUppercase(s: string) {
    return !!s.match(/[A-Z]/);
  }

  // change camelCase to snake-case
  public static fromExternal(str: string) {
    return str
      .split('')
      .map((c, idx) =>
        StringConverter.isUppercase(c) && idx > 0 ? `-${c}` : c
      )
      .map(c => c.toLowerCase())
      .join('');
  }

  // change snake-case to CamelCase
  public static toExternal(str: string, capitalizeFirstLetter = true) {
    return str
      .split('')
      .map((c, idx, strs) =>
        idx === 0 && capitalizeFirstLetter
          ? c.toUpperCase()
          : c === '-'
            ? c
            : strs[idx - 1] === '-'
              ? c.toUpperCase()
              : c
      )
      .filter(c => c !== '-')
      .join('');
  }
}
