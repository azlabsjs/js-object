import { getObjectProperty, JSObject, setObjectProperty } from '../src';

describe('JSObject utility test', () => {
  it('JSObject.isEmpty() should returns true for {} object and false for {lat: 3.08942, long: 1.8942}', () => {
    expect(JSObject.isEmpty({})).toBe(true);
    expect(JSObject.isEmpty({ lat: 3.08942, long: 1.8942 })).toBe(false);
  });

  it('JSObject.defaultIfEmpty() should returns default value if object is empty or undefined', () => {
    expect(JSObject.defaultIfEmpty(undefined, () => 2)).toBe(2);
    expect(
      JSObject.defaultIfEmpty({ lat: 3.08942, long: 1.8942 }, undefined)
    ).toEqual({ lat: 3.08942, long: 1.8942 });
  });

  it('JSObject.cloneDeep() should create a deep copy of the source object', () => {
    const source = {
      name: 'Azandrew',
      authorizations: new Set(['all', 'create-users', 'list-users']),
      address: {
        coord: new Map().set('lat', '3.458642').set('long', '1.6574822'),
      },
    };
    const copy = JSObject.cloneDeep(source);
    copy.name = 'Adevou Fera EKPEH';
    copy.authorizations.clear();
    copy.address.coord.set('lat', '2.867429');
    expect(source.name).not.toEqual(copy.name);
    expect(Array.from(source.authorizations)).not.toEqual([]);
    expect(Array.from(copy.authorizations)).toEqual([]);
  });

  it('JSObject.clone() should returns create a decomposed copy of {lat: 3.08942, long: 1.8942}', () => {
    const object = { lat: 3.08942, long: 1.8942 };
    const reference = object;
    const clone = JSObject.clone(object);
    reference.lat = 3.068131;
    clone.lat = 3.4267831;
    expect(reference).toEqual(object);
    expect(clone).not.toEqual(object);
  });

  it('JSObject.isDefined() should returns false for undefined and null', () => {
    expect(JSObject.isDefined(undefined)).toEqual(false);
    expect(JSObject.isDefined(null)).toEqual(false);
    expect(JSObject.isDefined({})).toEqual(true);
  });

  it('JSObject.isObject() should returns false for array like', () => {
    expect(JSObject.isJsObject([])).toEqual(false);
    expect(JSObject.isJsObject(new Object())).toEqual(true);
    expect(JSObject.isJsObject({})).toEqual(true);
  });

  it('JSObject.setProperty() should update nested level property if seperated by .', () => {
    const user = {
      name: 'Sidoine Azandrew',
      age: 29,
      sex: 'M',
      address: {
        city: 'LOME',
        district: 'HN',
        emails: ['azandrewdevelopper@gmail.com'],
        coord: { lat: 3.08942, long: 1.8942 },
      },
    };
    expect(
      JSObject.setProperty(
        setObjectProperty(user, 'name', 'MAMATHA THIBAULT'),
        'address.coord.lat',
        3.4267831
      ).name
    ).toEqual('MAMATHA THIBAULT');
    expect(user.address.coord.lat).toEqual(3.4267831);
  });

  it('JSObject.getProperty() should traverse and return value of nested level property if seperated by .', () => {
    const user = {
      name: 'Sidoine Azandrew',
      age: 29,
      sex: 'M',
      address: {
        city: 'LOME',
        district: 'HN',
        emails: ['azandrewdevelopper@gmail.com'],
        coord: { lat: 3.08942, long: 1.8942 },
      },
    };
    expect(JSObject.setProperty(user, '', '')).toBe(user);
    expect(JSObject.setProperty(undefined, 'age', 30)).toBe(undefined);
    JSObject.setProperty(user, 'address.coord.lat', 3.4267831);
    expect(JSObject.getProperty(user, 'address.coord.lat')).toEqual(3.4267831);
    expect(getObjectProperty(user, 'address.coord.lat')).toEqual(3.4267831);
  });

  it('JSObject.getProperty() should traverse and return value of nested level property if seperated by .', () => {
    const user = {
      name: 'Sidoine Azandrew',
      address: {
        coord: { lat: 3.08942, long: 1.8942 },
      },
    };
    expect(JSObject.flatten(user)).toEqual({
      name: 'Sidoine Azandrew',
      'address.coord.lat': 3.08942,
      'address.coord.long': 1.8942,
    });
  });
});
