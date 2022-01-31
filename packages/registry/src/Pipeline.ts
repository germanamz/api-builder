import uniqBy from 'lodash/uniqBy';

import Context from './Context';
import Stage from './Stage';

class Pipeline<C extends Context> {
  private $map: Map<string, Stage<C>>;

  readonly isPipeline = true;

  get map() {
    return this.$map;
  }

  get size() {
    return this.$map.size;
  }

  get entries() {
    return this.$map.entries();
  }

  constructor(entries?: [string, Stage<C>][]) {
    this.$map = new Map<string, Stage<C>>(entries);
  }

  append(refName: string, name: string, stage: Stage<C>) {
    const entries = Array.from(this.$map.entries());
    const refIndex = entries.findIndex(([itemName]) => itemName === refName);

    entries.splice(refIndex + 1, 0, [name, stage]);
    this.$map = new Map(entries);

    return this;
  }

  prepend(refName: string, name: string, stage: Stage<C>) {
    const entries = Array.from(this.$map.entries());
    const refIndex = entries.findIndex(([itemName]) => itemName === refName);

    entries.splice(refIndex - 1, 0, [name, stage]);
    this.$map = new Map(entries);

    return this;
  }

  add(name: string, stage: Stage<C>) {
    this.$map.set(name, stage);
    return this;
  }

  remove(name: string) {
    this.$map.delete(name);
    return this;
  }

  static concat<C extends Context = Context>(
    ...pipelines: Pipeline<any>[]
  ): Pipeline<C> {
    const entries: [string, Stage<any>][] = pipelines.reduce(
      (acc, pipeline: Pipeline<any>) => [
        ...acc,
        ...Array.from(pipeline.entries),
      ],
      [] as [string, Stage<any>][]
    );

    return new Pipeline<C>(
      uniqBy(entries, ([, fn]) => fn) as [string, Stage<any>][]
    );
  }
}

export default Pipeline;
