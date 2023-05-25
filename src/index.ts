/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AsyncStorageStatic } from '@react-native-async-storage/async-storage'
import type { AbstractKeyIteratorOptions, AbstractLevel as AbstractLevelType } from 'abstract-level'
import {
  AbstractDatabaseOptions,
  AbstractIterator,
  AbstractKeyIterator,
  AbstractLevel,
  AbstractValueIterator
} from 'abstract-level'

export type LevelErrorCode = 'LEVEL_PUT_ERROR' | 'LEVEL_NOT_FOUND' | 'LEVEL_GET_ERROR' | 'LEVEL_DEL_ERROR'
export class LevelError extends Error {
  public code: LevelErrorCode

  constructor(message: string, code: LevelErrorCode) {
    super(message)
    this.name = 'LevelError'
    this.code = code
  }
}

export type ValueType = string | number | boolean | null | undefined

export class RNAsyncStorageLevel extends AbstractLevel<string, string, ValueType> {
  protected storage: AsyncStorageStatic

  protected location: string

  constructor(storage: AsyncStorageStatic, location: string, options?: AbstractDatabaseOptions<string, string>) {
    const manifest: Partial<AbstractLevelType<string>['supports']> = {
      getMany: false,
      snapshots: false,
      permanence: true,
      keyIterator: true,
      valueIterator: true,
      iteratorNextv: true,
      iteratorAll: true,
      streams: false,
      seek: false,
      encodings: {
        utf8: true
      },
      events: {
        opening: true,
        open: true,
        closing: true,
        closed: true,
        put: true,
        del: true,
        batch: false,
        clear: true
      }
    }
    const mergedOptions: AbstractDatabaseOptions<string, string> = {
      createIfMissing: true,
      errorIfExists: false,
      keyEncoding: 'utf8',
      valueEncoding: 'utf8',
      ...options
    }

    super(manifest, mergedOptions)
    this.location = location
    this.storage = storage
  }

  protected _open(options: any, callback: (err?: Error | null) => void = () => {}): void {
    // AsyncStorage does not need an explicit open call.
    queueMicrotask(() => {
      callback()
    })
  }

  protected _close(callback: (err?: Error | null) => void = () => {}): void {
    // AsyncStorage does not need an explicit close call.
    queueMicrotask(() => {
      callback()
    })
  }

  protected _get(
    key: string,
    options: any,
    callback?: (err: Error | null, value?: ValueType) => void
  ): void | Promise<ValueType> {
    if (callback) {
      this.storage.getItem(`${this.location}/${key}`).then((value) => {
        if (value === null || value === undefined) {
          queueMicrotask(() => {
            callback(new LevelError(`Key ${key} not found`, 'LEVEL_NOT_FOUND'))
          })
        } else {
          queueMicrotask(() => {
            callback(null, value)
          })
        }
      })
    } else {
      return new Promise<ValueType>((resolve, reject) => {
        this.storage.getItem(`${this.location}/${key}`).then((value) => {
          if (value === null || value === undefined) {
            reject(new LevelError(`Key ${key} not found`, 'LEVEL_NOT_FOUND'))
          } else {
            resolve(value)
          }
        })
      })
    }
  }

  public getAllKeys(callback?: (err: Error | null, keys?: string[]) => void): void | Promise<string[]> {
    if (callback) {
      this.storage
        .getAllKeys()
        .then((keys) =>
          queueMicrotask(() => {
            callback(
              null,
              keys.filter((key) => key.startsWith(this.location)).map((key) => key.replace(`${this.location}/`, ''))
            )
          })
        )
        .catch((err) =>
          queueMicrotask(() => {
            callback(err)
          })
        )
    } else {
      return new Promise<string[]>((resolve, reject) => {
        this.storage
          .getAllKeys()
          .then((keys) =>
            resolve(
              keys.filter((key) => key.startsWith(this.location)).map((key) => key.replace(`${this.location}/`, ''))
            )
          )
          .catch((err) => reject(err))
      })
    }
  }

  protected _getMany(
    keys: string[],
    options: any,
    callback: (err: Error | null, value?: ValueType[]) => void
  ): void | Promise<ValueType[]> {
    if (callback) {
      this.storage
        .multiGet(keys.map((key) => `${this.location}/${key}`))
        .then((results) =>
          queueMicrotask(() => {
            callback(
              null,
              results.map(([key, value]) => value)
            )
          })
        )
        .catch((err) =>
          queueMicrotask(() => {
            callback(err)
          })
        )
    } else {
      return new Promise<ValueType[]>((resolve, reject) => {
        this.storage
          .multiGet(keys.map((key) => `${this.location}/${key}`))
          .then((results) => resolve(results.map(([key, value]) => value)))
          .catch((err) => reject(err))
      })
    }
  }

  protected _put(
    key: string,
    value: string,
    options: any,
    callback: (err?: Error | null) => void
  ): void | Promise<void> {
    console.log('am chemat _put')
    if (callback) {
      this.storage
        .setItem(`${this.location}/${key}`, value)
        .then(() =>
          queueMicrotask(() => {
            callback()
          })
        )
        .catch((err) =>
          queueMicrotask(() => {
            callback(new LevelError(err.message, 'LEVEL_PUT_ERROR'))
          })
        )
    } else {
      return new Promise<void>((resolve, reject) => {
        this.storage
          .setItem(`${this.location}/${key}`, value)
          .then(() => resolve())
          .catch((err) => reject(new LevelError(err.message, 'LEVEL_PUT_ERROR')))
      })
    }
  }

  protected _del(key: string, options: any, callback: (err?: Error | null) => void): void | Promise<void> {
    if (callback) {
      this.storage
        .removeItem(`${this.location}/${key}`)
        .then(() =>
          queueMicrotask(() => {
            callback()
          })
        )
        .catch((err) =>
          queueMicrotask(() => {
            callback(new LevelError(err.message, 'LEVEL_DEL_ERROR'))
          })
        )
    } else {
      return new Promise<void>((resolve, reject) => {
        this.storage
          .removeItem(`${this.location}/${key}`)
          .then(() => resolve())
          .catch((err) => reject(new LevelError(err.message, 'LEVEL_DEL_ERROR')))
      })
    }
  }

  protected _clear(options: any, callback: (err?: Error | null) => void): void | Promise<void> {
    if (callback) {
      this.storage
        .getAllKeys()
        .then((keys) => {
          const keysInLocation = keys.filter((key) => key.startsWith(`${this.location}/`))
          return this.storage.multiRemove(keysInLocation)
        })
        .then(() =>
          queueMicrotask(() => {
            callback()
          })
        )
        .catch((err) =>
          queueMicrotask(() => {
            callback(new LevelError(err.message, 'LEVEL_DEL_ERROR'))
          })
        )
    } else {
      return new Promise<void>((resolve, reject) => {
        this.storage
          .getAllKeys()
          .then((keys) => {
            const keysInLocation = keys.filter((key) => key.startsWith(`${this.location}/`))
            return this.storage.multiRemove(keysInLocation)
          })
          .then(() => resolve())
          .catch((err) => reject(new LevelError(err.message, 'LEVEL_DEL_ERROR')))
      })
    }
  }

  _iterator(options?: any): AsyncStorageIterator {
    return new AsyncStorageIterator(this, options)
  }

  _keys(options?: AbstractKeyIteratorOptions<string>): AsyncStorageKeyIterator {
    return new AsyncStorageKeyIterator(this, options)
  }

  _values(options?: any): AsyncStorageValueIterator {
    return new AsyncStorageValueIterator(this, options)
  }
}

export class AsyncStorageIterator extends AbstractIterator<RNAsyncStorageLevel, string, ValueType> {
  private keys: string[]

  private currentIndex: number

  constructor(database: RNAsyncStorageLevel, options: any) {
    super(database, options)
    this.keys = []
    this.currentIndex = 0
  }

  async _next(callback: (err?: Error | null, key?: string, value?: ValueType) => void): Promise<void> {
    if (!this.keys.length) {
      this.keys = (await this.db.getAllKeys()) as string[]
    }
    if (this.currentIndex >= this.keys.length) {
      callback()
      return
    }

    const key = this.keys[this.currentIndex++]
    const value = (await this.db.get(key)) as ValueType
    callback(null, key, value)
  }

  async _nextv(
    size: number,
    options: any,
    callback: (err: Error | null, entries?: [string, ValueType][]) => void
  ): Promise<void> {
    if (!this.keys.length) {
      this.keys = (await this.db.getAllKeys()) as string[]
    }
    const entries: [string, ValueType][] = []
    const endIndex = Math.min(this.currentIndex + size, this.keys.length)
    for (; this.currentIndex < endIndex; this.currentIndex++) {
      const key = this.keys[this.currentIndex]
      const value = (await this.db.get(key)) as ValueType
      entries.push([key, value])
    }
    callback(null, entries)
  }

  async _all(options: any, callback: (err: Error | null, entries?: [string, ValueType][]) => void): Promise<void> {
    if (!this.keys.length) {
      this.keys = (await this.db.getAllKeys()) as string[]
    }
    const entries: [string, ValueType][] = []
    for (; this.currentIndex < this.keys.length; this.currentIndex++) {
      const key = this.keys[this.currentIndex]
      const value = (await this.db.get(key)) as ValueType
      entries.push([key, value])
    }
    callback(null, entries)
  }

  _close(callback: () => void) {
    this.keys = []
    this.currentIndex = 0
    callback()
  }
}

export class AsyncStorageKeyIterator extends AbstractKeyIterator<RNAsyncStorageLevel, string> {
  private keys: string[]

  private currentIndex: number

  constructor(db: RNAsyncStorageLevel, options: AbstractKeyIteratorOptions<string>) {
    console.log('constructor AsyncStorageKeyIterator')
    super(db, options)
    this.keys = []
    this.currentIndex = 0
  }

  async _next(callback: (err?: Error | null, key?: string) => void): Promise<void> {
    console.log('_next')
    if (!this.keys.length) {
      this.keys = (await this.db.getAllKeys()) as string[]
    }
    // if (this.currentIndex >= this.keys.length) {
    //   callback()
    //   return
    // }

    const key = this.keys[this.currentIndex++]
    callback(null, key)
  }

  async _nextv(size: number, options: any, callback: (err: Error | null, keys?: string[]) => void): Promise<void> {
    if (!this.keys.length) {
      this.keys = (await this.db.getAllKeys()) as string[]
    }
    const keys = this.keys.slice(this.currentIndex, this.currentIndex + size)
    this.currentIndex += keys.length
    callback(null, keys)
  }

  async _all(options: any, callback: (err: Error | null, keys?: string[]) => void): Promise<void> {
    if (!this.keys.length) {
      this.keys = (await this.db.getAllKeys()) as string[]
    }
    const keys = this.keys.slice(this.currentIndex)
    this.currentIndex = this.keys.length
    callback(null, keys)
  }

  _close(callback: () => void) {
    this.keys = []
    this.currentIndex = 0
    callback()
  }
}

export class AsyncStorageValueIterator extends AbstractValueIterator<RNAsyncStorageLevel, string, ValueType> {
  private keys: string[]

  private currentIndex: number

  constructor(db: RNAsyncStorageLevel, options: any) {
    super(db, options)
    this.keys = []
    this.currentIndex = 0
  }

  async _next(callback: (err?: Error | null, value?: ValueType) => void): Promise<void> {
    console.log('_next')
    if (!this.keys.length) {
      this.keys = (await this.db.getAllKeys()) as string[]
    }
    if (this.currentIndex >= this.keys.length) {
      callback()
      return
    }

    const key = this.keys[this.currentIndex++]
    const value = (await this.db.get(key)) as ValueType
    callback(null, value)
  }

  async _nextv(size: number, options: any, callback: (err: Error | null, values?: ValueType[]) => void): Promise<void> {
    console.log('_nextv')
    if (!this.keys.length) {
      this.keys = (await this.db.getAllKeys()) as string[]
    }
    const endIndex = Math.min(this.currentIndex + size, this.keys.length)
    const fetchPromises = this.keys.slice(this.currentIndex, endIndex).map((key) => this.db.get(key))
    const values = await Promise.all(fetchPromises)
    this.currentIndex = endIndex
    callback(null, values)
  }

  async _all(options: any, callback: (err: Error | null, values?: ValueType[]) => void): Promise<void> {
    console.log('_all', this.keys)
    if (!this.keys.length) {
      this.keys = (await this.db.getAllKeys()) as string[]
    }
    const endIndex = Math.min(this.currentIndex, this.keys.length)
    console.log('currentIndex', this.currentIndex, 'keys', length, 'endIndex', endIndex)
    const fetchPromises = this.keys.slice(this.currentIndex, endIndex).map((key) => this.db.get(key))
    const values = await Promise.all(fetchPromises)
    this.currentIndex = endIndex
    callback(null, values)
  }

  _close(callback: () => void) {
    this.keys = []
    this.currentIndex = 0
    callback()
  }
}
