import { clone, cloneDeep } from '@azlabsjs/clone';
import { isDefined, isEmpty, isObject, isPrimitive } from '@azlabsjs/utilities';

/**
 * Global functional interface for getting proprety value of a JS object
 * @param value
 * @param key
 * @returns
 */
export const getObjectProperty = (value: object | any, key: string) =>
  JSObject.getProperty(value, key);

/**
 * Global functional interface for setting proprety value of a JS object
 *
 * @param source
 * @param key
 * @param value
 * @returns
 */
export const setObjectProperty = (
  source: object | any,
  key: string,
  value?: any
) => JSObject.setProperty(source, key, value);

export class JSObject extends Object {
  /**
   * Returns true if the object is empty
   *
   * @param value
   * @returns
   */
  static isEmpty = <T>(value: T) => isEmpty(value);

  /**
   * Returns the default value passed by used if the value of the object is empty
   *
   * @param value
   * @param default_
   * @returns
   */
  static defaultIfEmpty = <T>(value: T, default_: any = {}) =>
    !JSObject.isEmpty(value)
      ? value
      : typeof default_ === 'function'
      ? default_()
      : default_;

  /**
   * Creates a deep copy of the given object
   *
   * @param value
   * @returns
   */
  static cloneDeep = <T extends { [index: string]: any }>(value: T) =>
    cloneDeep(value);

  /**
   * Compute a copy by decomposition on a Javascript object
   *
   * @param source
   * @returns
   */
  static clone = <T>(source: T) => clone(source) as T;

  /**
   * Check if the value of the object is not equals to null or undefined
   *
   * @param value
   */
  static isDefined = (value: any) => isDefined(value);

  /**
   * Check if value is an instance of Javascript object
   * @param value
   * @returns
   */
  static isJsObject = (value: any) => isObject(value);

  /**
   * Set property value of a JS Object
   *
   * @param source
   * @param key
   * @param value
   * @returns
   */
  static setProperty = <T extends object>(
    source: T | undefined,
    key: string,
    value?: any,
    strict = false,
    seperator = '.'
  ) => {
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
      // TODO : Point the reference to the object
      let ref: any = source;
      while (properties.length > 1) {
        const prop = properties.shift();
        if (
          (prop && !JSObject.isDefined(ref[prop])) ||
          (prop && !JSObject.isJsObject(ref[prop]))
        ) {
          if (strict) {
            throw new Error(
              `Property ${prop} does not exists in object: ${JSON.stringify(
                ref
              )}`
            );
          }
          // TODO : Point the reference to an empty object
          // ref[prop] = {};
          JSObject.setProperty_(ref, prop, {});
        }
        if (prop) {
          // TODO : Point the reference to the inner object attached to the property
          // Use a cleaner getter
          ref = ref[prop];
        }
      }
      const prop = properties.shift() ?? '';
      if (prop && ref) {
        if (!(prop in ref) && strict) {
          throw new Error(
            `Property ${prop} does not exists in object: ${JSON.stringify(ref)}`
          );
        }
        JSObject.setProperty_(ref, prop, value ?? undefined);
      }
    } else {
      if (!(key in source) && strict) {
        throw new Error(
          `Property ${source} does not exists in object: ${JSON.stringify(
            source
          )}`
        );
      }
      JSObject.setProperty_(source, key, value ?? undefined);
    }
    return source;
  };

  /**
   * @description Get property from a JS obecjt. The function dynamically load property that are inner property
   * of the given object.
   * @param source [[object]]
   * @param key [[string]]
   */
  static getProperty = <T extends { [prop: string]: any }>(
    source: T,
    key: string,
    seperator = '.'
  ) => {
    if (key === '' || !JSObject.isDefined(key) || !JSObject.isDefined(source)) {
      return source ?? undefined;
    }
    if (key.includes(seperator ?? '.')) {
      // Creates an array of inner properties
      const properties = key.split(seperator ?? '.');
      const current = source;
      // Reduce the source object to a single value
      return properties.reduce((carry, prop) => {
        if (carry) {
          carry =
            JSObject.isJsObject(current) && carry[prop]
              ? carry[prop] ?? undefined
              : undefined;
        }
        return carry;
      }, source);
    } else {
      return source ? source[key] : undefined;
    }
  };

  /**
   * @description Helper function for flattening an object properties
   * @param source [[object]]
   */
  static flatten = (
    source: { [index: string]: any },
    prefix = true
  ) => {
    if (isPrimitive(source)) {
      return source;
    }
    const dst: { [index: string]: any } = {};
    for (const prop in source) {
      if (!(prop in source)) {
        continue;
      }
      if (isPrimitive(source[prop]) || Array.isArray(source[prop])) {
        dst[prop] = source[prop];
      } else {
        const flatten = JSObject.flatten(source[prop], prefix);
        for (const propx in flatten) {
          if (!(propx in flatten)) {
            continue;
          }
          const key = prefix ? prop + '.' + propx : propx;
          dst[key] = flatten[propx];
        }
      }
    }
    return dst;
  };

  private static setProperty_ = (object_: object, prop: string, value: any) => {
    // TODO : Get default object descriptors
    const descriptors = Object.getOwnPropertyDescriptor(object_, prop) ?? {};
    // Modify object applying overriding my descriptors with the defaults
    Object.defineProperty(object_, prop, {
      // TODO : Use default if no previous descriptor
      ...{
        writable: true,
        configurable: true,
        enumerable: true,
      },
      // Build with old descriptors by decomposition
      ...descriptors,
      // TODO : Modify the value
      value: value,
    });
  };
}
