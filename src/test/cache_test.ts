import * as cache from 'memory-cache';

(function () {

    function getNow() {
        const key = 'now';
        let value = cache.get(key);
        if (value)
            return value;
        value = Date.now();
        cache.put(key, value, 1000 * 5);
        return value;
    }

    setInterval(() => {
        let result = getNow();
        console.log(result);

     }, 1000);

}())
