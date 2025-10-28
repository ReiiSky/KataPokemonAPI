export class Option<T> {
  private readonly value?: T;

  private constructor(value: T) {
    if (typeof value === 'number') {
      this.value = Number.isNaN(value) ? undefined : value;
      return;
    }

    this.value = value;
  }

  public static some<T>(value: T) {
    return new Option(value);
  }

  public static none<T>() {
    return new Option<T>(undefined as T);
  }

  public get isNone() {
    return this.value === null || this.value === undefined;
  }

  public use<TReturn>(
    func: (value: NonNullable<T>) => TReturn
  ): Option<TReturn> {
    if (this.isNone) {
      return Option.none();
    }

    const newValue = func(this.value as NonNullable<T>);
    return Option.some(newValue);
  }

  public should(func: (value: NonNullable<T>) => boolean): Option<T> {
    if (this.isNone) {
      return Option.none();
    }

    const ok = func(this.value);

    if (!ok) {
      return Option.none();
    }

    return this;
  }

  public unwrap(defaultValue: T): T {
    if (this.isNone) {
      return defaultValue;
    }

    return this.value as T;
  }

  public lazyUnwrap(fn: () => T): T {
    if (this.isNone) {
      return fn();
    }

    return this.value;
  }

  public yolo(): T {
    return this.value;
  }
}
