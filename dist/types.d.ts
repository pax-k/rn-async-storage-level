import { AsyncStorageStatic } from "@react-native-async-storage/async-storage";
import { AbstractKeyIteratorOptions, AbstractDatabaseOptions, AbstractIterator, AbstractKeyIterator, AbstractLevel, AbstractValueIterator } from "abstract-level";
export type LevelErrorCode = 'LEVEL_PUT_ERROR' | 'LEVEL_NOT_FOUND' | 'LEVEL_GET_ERROR' | 'LEVEL_DEL_ERROR' | 'LEVEL_INVALID_VALUE';
export class LevelError extends Error {
    code: LevelErrorCode;
    constructor(message: string, code: LevelErrorCode);
}
export type ValueType = string | number | boolean | null | undefined;
export class RNAsyncStorageLevel extends AbstractLevel<string, string, ValueType> {
    protected storage: AsyncStorageStatic;
    protected location: string;
    constructor(storage: AsyncStorageStatic, location: string, options?: AbstractDatabaseOptions<string, string>);
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
