export class Identifier<T = number> {
  private constructor(private readonly _id: T) {}

  public clone(): Identifier<T> {
    return new Identifier(this._id);
  }

  public equal(other: Identifier<T> | number): boolean {
    if (typeof other === 'number') {
      return this._id === other;
    }

    return this._id === other._id;
  }

  public static new<T>(value: T): Identifier<T> {
    return new Identifier(value);
  }

  public static newNone(): Identifier<number> {
    return new Identifier(0);
  }

  public static newNoneEmpty(): Identifier<string> {
    return new Identifier('');
  }

  public get isNone() {
    return (
      this._id === 0 || (typeof this._id === 'string' && this._id.length === 0)
    );
  }

  public get value() {
    return this._id;
  }
}
