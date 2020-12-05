import { Map } from 'immutable'

export class Immutable<TDocument, TModel extends Immutable<TDocument, TModel>> {
  protected data: Map<string, any>

  constructor(
    private ctor: new (data: TDocument | Map<string, any>) => TModel,
    public data_: TDocument | Map<string, any>
  ) {
    this.data = Map<string, any>(data_ as any)
  }

  toJS(): any {
    return this.data.toJS()
  }

  protected setValue(key: string, value: any): TModel {
    return new this.ctor(this.data.set(key, value))
  }
}
