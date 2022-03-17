# Documentation

# JS object

Global functional interface for setting and getting proprety value of a JS object

# EXAMPLE USAGE

## `JSObject.isEmpty()`

> Should returns true for {} object and false for {lat: 3.08942, long: 1.8942}

```ts
JSObject.isEmpty({})).toBe(true);

JSObject.isEmpty({ lat: 3.08942, long: 1.8942 })).toBe(false);
```

## `JSObject.defaultIfEmpty()`

> Should returns default value if object is empty or undefined

```ts
JSObject.defaultIfEmpty(undefined, () => 2)).toBe(2);

JSObject.defaultIfEmpty({ lat: 3.08942, long: 1.8942 }, undefined)
```

## `JSObject.cloneDeep()`

> Should create a deep copy of the source object

```ts
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
```

## `JSObject.clone()`

> Should returns create a decomposed copy of {lat: 3.08942, long: 1.8942}

```ts
const object = { lat: 3.08942, long: 1.8942 };
const reference = object;
const clone = JSObject.clone(object);
reference.lat = 3.068131;
clone.lat = 3.4267831;
```

## `JSObject.isDefined()`

> Should returns false for undefined and null

```ts
JSObject.isDefined(undefined);

JSObject.isDefined(null);

JSObject.isDefined({});
```

## `JSObject.isObject()`

> Should returns false for array like

```ts
JSObject.isJsObject([]);

JSObject.isJsObject(new Object());

JSObject.isJsObject({});
```

## `JSObject.setProperty()`

> Should update nested level property if seperated by .

```ts
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

JSObject.setProperty(
  setObjectProperty(user, 'name', 'MAMATHA THIBAULT'),
  'address.coord.lat',
  3.4267831
).name;
```

## `JSObject.getProperty()`

> Should traverse and return value of nested level property if seperated by .

```ts
(JSObject.getProperty(user, 'address.coord.lat')
```
