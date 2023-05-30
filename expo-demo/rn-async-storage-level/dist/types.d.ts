import { AbstractDatabaseOptions, AbstractLevel, AbstractKeyIteratorOptions, AbstractIterator, AbstractKeyIterator, AbstractValueIterator } from "abstract-level";
import { AsyncStorageStatic } from "@react-native-async-storage/async-storage";
export type LevelType = AbstractLevel<string>;
export class LevelFactory {
    static createAbstractLevel<T extends AbstractLevel<string>>(levelClass: new (location: string, options?: AbstractDatabaseOptions<string, string>) => T, location: string, options?: AbstractDatabaseOptions<string, string>): T;
}
export type LevelErrorCode = 'LEVEL_PUT_ERROR' | 'LEVEL_NOT_FOUND' | 'LEVEL_GET_ERROR' | 'LEVEL_DEL_ERROR' | 'LEVEL_INVALID_VALUE' | 'LEVEL_IO_ERROR';
export class LevelError extends Error {
    code: LevelErrorCode;
    constructor(message: string, code: LevelErrorCode);
}
export type ValueType = string;
export class RNAsyncStorageLevel extends AbstractLevel<string, string, ValueType> {
    protected storage: AsyncStorageStatic;
    protected location: string;
    constructor(location: string, options?: AbstractDatabaseOptions<string, string>);
    setStorage(storage: AsyncStorageStatic): void;
    protected _open(options: any, callback?: (err?: Error | null) => void): void;
    protected _close(callback?: (err?: Error | null) => void): void;
    protected _get(key: string, options: any, callback?: (err: Error | null, value?: ValueType) => void): void | Promise<ValueType>;
    _getAllKeys(callback?: (err: Error | null, keys?: string[]) => void): void | Promise<string[]>;
    protected _getMany(keys: string[], options: any, callback: (err: Error | null, value?: ValueType[]) => void): void | Promise<ValueType[]>;
    protected _put(key: string, value: string, options: any, callback: (err?: Error | null) => void): void | Promise<void>;
    protected _del(key: string, options: any, callback: (err?: Error | null) => void): void | Promise<void>;
    protected _clear(options: any, callback: (err?: Error | null) => void): void | Promise<void>;
    _iterator(options?: any): AsyncStorageIterator;
    _keys(options?: AbstractKeyIteratorOptions<string>): AsyncStorageKeyIterator;
    _values(options?: any): AsyncStorageValueIterator;
}
export class AsyncStorageIterator extends AbstractIterator<RNAsyncStorageLevel, string, ValueType> {
    constructor(database: RNAsyncStorageLevel, options: any);
    _all(options: any, callback: (err: Error | null, entries?: [string, ValueType][]) => void): Promise<void>;
    _close(callback: () => void): void;
}
export class AsyncStorageKeyIterator extends AbstractKeyIterator<RNAsyncStorageLevel, string> {
    constructor(db: RNAsyncStorageLevel, options: AbstractKeyIteratorOptions<string>);
    _all(options: any, callback: (err: Error | null, keys?: string[]) => void): Promise<void>;
    _close(callback: () => void): void;
}
export class AsyncStorageValueIterator extends AbstractValueIterator<RNAsyncStorageLevel, string, ValueType> {
    constructor(db: RNAsyncStorageLevel, options: any);
    _all(options: any, callback: (err: Error | null, values?: ValueType[]) => void): Promise<void>;
    _close(callback: () => void): void;
}

//# sourceMappingURL=types.d.ts.map
