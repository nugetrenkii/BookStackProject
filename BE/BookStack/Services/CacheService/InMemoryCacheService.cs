using Microsoft.Extensions.Caching.Memory;

namespace BookStack.Services.CacheService;

public class InMemoryCacheService : ICacheService
{
    private readonly IMemoryCache _memoryCache;

    public InMemoryCacheService(IMemoryCache memoryCache)
    {
        _memoryCache = memoryCache;
    }

    // Retrieves an item from the cache
    public T Get<T>(string key)
    {
        return _memoryCache.TryGetValue(key, out T value) ? value : default;
    }

    // Adds an item to the cache with an expiration time
    public void Set<T>(string key, T value, TimeSpan expiration)
    {
        var cacheEntryOptions = new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = expiration
        };
        _memoryCache.Set(key, value, cacheEntryOptions);
    }

    // Removes an item from the cache
    public void Remove(string key)
    {
        _memoryCache.Remove(key);
    }

    // Checks if an item exists in the cache
    public bool Exists(string key)
    {
        return _memoryCache.TryGetValue(key, out _);
    }
}