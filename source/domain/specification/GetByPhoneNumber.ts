export class GetByPhoneNumber {
  public constructor(public readonly phoneNumber: string) {}

  public get specname() {
    return GetByPhoneNumber.name;
  }
}
