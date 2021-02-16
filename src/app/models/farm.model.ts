export class Farm {
  public id: number;
  public name: string;

  constructor(
    data: any,
  ) {
    Object.assign(this, data);
  }

}