export abstract class StorageLocalStoreService<T> {
  private readonly STORAGE_MAIN_KEY = 'MESSAGE_APP';
  private storageKey: string;
  private defaultValues: T;

  constructor(key: string, defaultValues: T) {
    this.storageKey = key;
    this.defaultValues = defaultValues;
  }

  saveData(data: T): void {
    const savedData = this.getDataFromLocalStorage();
    const newData = { [this.storageKey]: data };
    const mergedData = JSON.stringify({ ...savedData, ...newData });

    localStorage.setItem(this.STORAGE_MAIN_KEY, mergedData);
  }

  getData(): T {
    const data = this.getDataFromLocalStorage();
    return data[this.storageKey] ?? this.defaultValues;
  }

  removeData(): void {
    const data = this.getDataFromLocalStorage();
    const newData = { ...data, [this.storageKey]: null };
    localStorage.setItem(this.STORAGE_MAIN_KEY, JSON.stringify(newData));
  }

  clearLocalStorage(): void {
    localStorage.removeItem(this.STORAGE_MAIN_KEY);
  }

  private getDataFromLocalStorage(): { [key: string]: any } {
    const data = localStorage.getItem(this.STORAGE_MAIN_KEY) ?? '{}';
    return JSON.parse(data);
  }
}
