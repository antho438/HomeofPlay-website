export const paginate = (array: any[], page: number, pageSize: number) => {
  return array.slice((page - 1) * pageSize, page * pageSize);
};

export const cacheData = (key: string, data: any, ttl: number = 300000) => {
  const item = {
    data,
    timestamp: Date.now(),
    ttl
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getCachedData = (key: string) => {
  const item = localStorage.getItem(key);
  if (!item) return null;

  const { data, timestamp, ttl } = JSON.parse(item);
  if (Date.now() - timestamp > ttl) {
    localStorage.removeItem(key);
    return null;
  }
  return data;
};
