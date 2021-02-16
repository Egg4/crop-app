export class Plant {
  public id: number;
  public name: string;
  public family: string;
  public genus: string;
  public species: string;
  public color: string;

  constructor(
    data: any,
  ) {
    Object.assign(this, data);
  }

  public static compare(a: Plant, b: Plant): number {
    const nameA = a.name.removeDiacritics();
    const nameB = b.name.removeDiacritics();
    if (nameA === nameB) return 0;
    return nameA > nameB ? 1 : -1;
  }

}