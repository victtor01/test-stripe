export abstract class Entity<Props> {
  private _id: string;
  protected props: Props;

  get id() {
    return this._id;
  }

  protected constructor(props: Props, id?: string) {
   this.props = Object.freeze(props);
    this._id = id ?? crypto.randomUUID();
  }

   protected snapshot(): Readonly<Props> {
    return this.props;
  }
}