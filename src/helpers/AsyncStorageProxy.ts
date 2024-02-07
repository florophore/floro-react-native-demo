import AsyncStorage from '@react-native-async-storage/async-storage'

// just replace with mmkv if you need
export default class AsyncStorageProxy {

    static getItem(key: string): Promise<string|undefined> {
        //if mmkv Promise.resolve(storage.getString(key))
        return AsyncStorage.getItem(key);
    }
    static async getAllKeys(): Promise<readonly string[]> {
        //if mmkv Promise.resolve(storage.getString(key))
        return await AsyncStorage.getAllKeys();
    }

    static removeItem(key: string): void {
        //if mmkv storage.delete(key)
        AsyncStorage.removeItem(key)
    }

    static setItem(key: string, value: string): void {
        //if mmkv storage.set(key, value)
        AsyncStorage.setItem(key, value);
    }

}