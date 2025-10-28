export class Regex {
  public static matchAll(pattern: RegExp, str: string): RegExpExecArray[] {
    const matches: RegExpExecArray[] = [];
    let lastIndex = 0;

    for (;;) {
      const match = pattern.exec(str.slice(lastIndex));

      if (!match) {
        break;
      }

      matches.push(match);
      lastIndex = match.index + match[0].length;
    }

    return matches;
  }
}
