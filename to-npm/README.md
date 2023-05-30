# ⚡️ RNAsyncStorageLevel

This is an [`abstract-level`](https://github.com/Level/abstract-level) implementation of [`AsyncStorage`](https://react-native-async-storage.github.io/async-storage/) for React Native using TypeScript.

It was tested with Expo SDK 48 for iOS & Android.

❗️❗️❗️ Moved to [`@hyphen-id/rn-async-storage-level`](https://www.npmjs.com/package/@hyphen-id/rn-async-storage-level) ❗️❗️❗️

# 🔥 Prerequisites

`AsyncStorage` has to be installed, and development builds have to be created:

```
yarn add @react-native-async-storage/async-storage
yarn expo run:ios
yarn expo run:android
```

# 💿 Installation

```
yarn add @pax-k/rn-async-storage-level
```

# 🏋️ Usage

## ✅ With promises (prefered way)

```
import { RNAsyncStorageLevel } from '@pax-k/rn-async-storage-level'
import AsyncStorage from '@react-native-async-storage/async-storage'

async function withAsync() {
  try {
    // create a new db
    const db = new RNAsyncStorageLevel(AsyncStorage, 'my-db-1')

    // listen for 'put' events
    db.on('put', (key, value) => {
      console.log('event: put', key, value)
    })

    // listen for 'del' events
    db.on('del', (key) => {
      console.log('event: del', key)
    })

    // listen for 'clear' events
    db.on('clear', () => {
      console.log('event: clear')
    })

    // write some data
    await db.put('key1', 'value1')
    await db.put('key2', 'value2')

    // get the value of one key
    console.log(await db.get('key1'))

    // get the values of multiple keys
    console.log(await db.getMany(['key1', 'key2']))

    // get all keys
    console.log(await db.keys().all())

    // get all values
    console.log(await db.values().all())

    // get all entries
    console.log(await db.iterator().all())

    // delete a key
    await db.del('key1')

    // clear db
    await db.clear()
  } catch (error) {
    console.error(error)
  }
}

```

## 🌝 With callbacks (prefer promises)

```
import { RNAsyncStorageLevel } from '@pax-k/rn-async-storage-level'
import AsyncStorage from '@react-native-async-storage/async-storage'

async function withCallbacks() {
  // create a new db
  const db = new RNAsyncStorageLevel(AsyncStorage, 'my-db-1')

  // listen for 'put' events
  db.on('put', (key, value) => {
    console.log('event: put', key, value)
  })

  // listen for 'del' events
  db.on('del', (key) => {
    console.log('event: del', key)
  })

  // listen for 'clear' events
  db.on('clear', () => {
    console.log('event: clear')
  })

  // write some data
  db.put('key1', 'value1', (err) => {
    if (err) console.error(err)
    console.log('put callback')
  })

  db.put('key2', 'value2', (err) => {
    if (err) console.error(err)
    console.log('put callback')
  })

  // get the value of one key
  db.get('key1', (err, result) => {
    if (err) console.error(err)
    console.log('get callback', result)
  })

  // get the values of multiple keys
  db.getMany(['key1', 'key2'], (err, result) => {
    if (err) console.error(err)
    console.log('getMany callback', result)
  })

  // get all keys
  db.keys().all((err, result) => {
    if (err) console.error(err)
    console.log('keys callback', result)
  })

  // get all values
  db.values().all((err, result) => {
    if (err) console.error(err)
    console.log('values callback', result)
  })

  // get all entries
  db.iterator().all((err, result) => {
    if (err) console.error(err)
    console.log('iterator callback', result)
  })

  // delete a key
  db.del('key1', (err) => {
    if (err) console.error(err)
    console.log('del callback')
  })

  // clear db
  db.clear((err) => {
    if (err) console.error(err)
    console.log('clear callback')
  })
}

```

# 🙋‍♂️ FAQ

## 👉🏻 Why build this

There was no modern and actively maintained `abstract-level` compatible storage for React Native.

## 👉🏻 Why this works

`abstract-level` uses NodeJS native functions which won't work in a browser (or in the Hermes JS engine for React Native). At build time, `parcel` [pollyfills](https://parceljs.org/features/node-emulation#polyfilling-%26-excluding-builtin-node-modules) some of the native functions, but misses `text-encoding`. This is injected by [`build.sh`](build.sh), then `browserify` bundles everything together into a 100% browser compatible module.

Apart from bundling, it is important to have `AsyncStorage` module installed in the consumer app, for it to referece the correct bindings. This is why it needs to be refereced from the app:

```
const db = new RNAsyncStorageLevel(AsyncStorage, 'my-db-1')
```

# 🚧 Limitations

- [Known storage limits](https://react-native-async-storage.github.io/async-storage/docs/limits)
- a value's type is limited to `string | number | boolean | null | undefined`
- no support for `snapshots, keyIterator, valueIterator, iteratorNextv, streams, seek, batch`
- without support for snapshots, isolation of transactions is instead guaranteed by using await/promises (as they are sequential), as opposed to callbacks that use `queueMicrotask`

# 👷 TODO

- support for `keyIterator, valueIterator, iteratorNextv, batch` operations
- support for `Uint8Array` as value type (for storing files as blobs)
- caching + invalidation
- add tests

# 🌈 Shouts 👏🏻

To [Hyphen](https://hyphen.id/) for sponsoring this effort and to [TBD](https://www.tbd.website/) for powering the next wave of private & decentralised apps.

# 👋 Contribute

## Running the project locally

```
git clone https://github.com/pax-k/rn-async-storage-level && cd rn-async-storage-level
yarn
cd expo-demo && yarn && yarn expo start:ios
cd ../ && yarn watch
```
