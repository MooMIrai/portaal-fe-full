/**
 * Abstract base class for adapters that convert a source object of type TSource to a target object of type TTarget.
 * @template TSource - The type of the source object.
 * @template TTarget - The type of the target object.
 */
export abstract class BaseAdapter<TSource, TTarget> {
  abstract adapt(source?: TSource): TTarget;

  abstract reverseAdapt(source?: TTarget): TSource;

  adaptList(source?: TSource[]) {
    if (!source) return null;
    return source.map(this.adapt);
  }
}
