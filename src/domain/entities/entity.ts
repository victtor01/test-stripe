import { BaseId } from '../values/BaseId';

export abstract class Entity<Props, Tid extends BaseId> {
  private _id: Tid;
  protected props: Props;

  get id() {
    return this._id;
  }

  get idVo(): Tid {
    return this._id;
  }

  protected abstract nextId(): string;

  protected constructor(props: Props, id: Tid) {
    this.props = props;
    this._id = id;
    Object.freeze(this);
  }

  protected snapshot(): Readonly<Props> {
    return this.props;
  }
}
