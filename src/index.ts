import { clone, cloneDeep } from '@azlabsjs/clone';
import { isDefined, isEmpty, isObject, isPrimitive } from '@azlabsjs/utilities';

/** @description global functional interface for getting proprety value of a JS object */
export function getObjectProperty<
  T extends { [k: string | symbol]: unknown } | null | undefined = {
    [k: string | symbol]: unknown;
  },
>(value: T, key: string | symbol) {
  return JSObject.getProperty(value, key);
}

/** @description Global functional interface for setting proprety value of a JS object */
export function setObjectProperty<
  T extends { [k: string | symbol]: unknown } | null | undefined = {
    [k: string | symbol]: unknown;
  },
>(source: T, key: string, value?: unknown): T {
  return JSObject.setProperty(source, key, value);
}

export class JSObject {
  /** returns true if the object is empty */
  static isEmpty = <T>(value: T) => isEmpty(value);

  /** returns the default value passed by used if the value of the object is empty */
  static defaultIfEmpty<T>(value: T, def: T | ((...args: unknown[]) => T)) {
    return !JSObject.isEmpty(value)
      ? value
      : typeof def === 'function'
        ? (def as (...args: unknown[]) => T)()
        : def;
  }

  /** creates a deep copy of the given object */
  static cloneDeep<T extends { [index: string]: unknown }>(value: T) {
    return cloneDeep(value);
  }

  /** compute a copy by decomposition on a javascript object */
  static clone<T>(source: T) {
    return clone(source) as T;
  }

  /** check if the value of the object is not equals to null or undefined */
  static isDefined(value: unknown) {
    return isDefined(value);
  }

  /** check if value is an instance of Javascript object */
  static isJsObject(value: unknown) {
    return isObject(value);
  }

  /** set property value of a JS Object */
  static setProperty<
    T extends { [k: string | symbol]: unknown } | null | undefined,
  >(
    source: T,
    key: string,
    value?: unknown,
    strict = false,
    seperator = '.'
  ): T {
    if (key === '') {
      return source;
    }
    if (!JSObject.isDefined(key)) {
      return source;
    }
    if (typeof source === 'undefined' || source === null) {
      return source;
    }
    if (key.includes(seperator ?? '.')) {
      // Creates an array of inner properties
      const properties = key.split(seperator ?? '.');
      let ref: typeof source = source;
      while (properties.length > 1) {
        const prop = properties.shift();
        if (
          (prop && !JSObject.isDefined(ref[prop as keyof typeof ref])) ||
          (prop && !JSObject.isJsObject(ref[prop as keyof typeof ref]))
        ) {
          if (strict) {
            throw new Error(
              `Property ${prop} does not exists in object: ${JSON.stringify(
                ref
              )}`
            );
          }
          JSObject.setPropertyValue(ref, prop, {});
        }
        if (prop) {
          // Use a cleaner getter
          ref = ref[prop as keyof typeof ref] as typeof ref;
        }
      }
      const prop = properties.shift() ?? '';
      if (prop && ref) {
        if (!(prop in ref) && strict) {
          throw new Error(
            `Property ${prop} does not exists in object: ${JSON.stringify(ref)}`
          );
        }
        JSObject.setPropertyValue(ref, prop, value ?? undefined);
      }
    } else {
      if (!(key in source) && strict) {
        throw new Error(
          `Property ${source} does not exists in object: ${JSON.stringify(
            source
          )}`
        );
      }
      JSObject.setPropertyValue(source, key, value ?? undefined);
    }

    return source;
  }

  /** @description get property from a JS obecjt. The function dynamically load property that are inner property */
  static getProperty = <
    T extends { [prop: string | symbol]: unknown } | null | undefined,
  >(
    source: T,
    key: string | symbol,
    seperator = '.'
  ) => {
    if (typeof source === 'undefined' || source === null) {
      return source;
    }

    if (key === '' || !JSObject.isDefined(key)) {
      return source ?? undefined;
    }

    if (typeof key === 'string' && key.includes(seperator ?? '.')) {
      // Creates an array of inner properties
      const properties = key.split(seperator ?? '.');
      const current = source;
      // Reduce the source object to a single value
      return properties.reduce((carry, prop) => {
        if (carry) {
          carry = (
            JSObject.isJsObject(current) && carry[prop]
              ? (carry[prop] ?? undefined)
              : undefined
          ) as T;
        }
        return carry;
      }, source as T);
    } else {
      return source ? source[key] : undefined;
    }
  };

  /** @description helper function for flattening an object properties */
  static flatten<
    T extends { [index: string]: unknown } = { [index: string]: unknown },
  >(source: T, prefix = true) {
    if (isPrimitive(source)) {
      return source;
    }
    let dst: typeof source = {} as T;
    for (const prop in source) {
      if (!(prop in source)) {
        continue;
      }
      if (isPrimitive(source[prop]) || Array.isArray(source[prop])) {
        dst[prop] = source[prop];
      } else {
        const flatten = JSObject.flatten(source[prop] as typeof source, prefix);
        for (const propx in flatten) {
          if (!(propx in flatten)) {
            continue;
          }
          const key = prefix ? prop + '.' + propx : propx;
          dst = Object.assign(dst, { [key]: flatten[propx] });
        }
      }
    }
    return dst;
  }

  private static setPropertyValue = (
    object_: object,
    prop: string,
    value: unknown
  ) => {
    const descriptors = Object.getOwnPropertyDescriptor(object_, prop) ?? {};

    Object.defineProperty(object_, prop, {
      ...{
        writable: true,
        configurable: true,
        enumerable: true,
      },
      // Build with old descriptors by decomposition
      ...descriptors,
      value: value,
    });
  };
}
