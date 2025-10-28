export class Generator {
  public static readonly extendedCharacters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+[]{}|;:,.<>?';

  static randomNumber(length: number) {
    const letterNumber = Generator.generateOTPCode(length);

    return Number(letterNumber);
  }

  static randomInteger(max: number) {
    return Math.floor(Math.random() * max);
  }

  static generateOTPCode(length = 4) {
    let letterNumber = '';

    for (let i = 0; i < length; i++) {
      letterNumber += (Math.random() * 10).toString()[0];
    }

    return letterNumber;
  }

  public static randomCharacter(
    length: number,
    character = 'abcdefghijklmnopqrstuvwxyz1234567890'
  ) {
    let letter = '';

    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * character.length);
      letter += character[idx];
    }

    return letter;
  }

  public static generateUID() {
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const capitalize = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeric = '1234567890';

    return Generator.randomCharacter(32, `${alpha}-${capitalize}-${numeric}`);
  }

  public static generateSalt() {
    return Generator.randomCharacter(32, Generator.extendedCharacters);
  }
}
