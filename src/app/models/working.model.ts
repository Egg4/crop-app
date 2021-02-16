export class Working {
  public id: number;
  public task_id: number;
  public duration: string;
  public mwu: number;

  constructor(
    data: any,
  ) {
    Object.assign(this, data);
  }

}