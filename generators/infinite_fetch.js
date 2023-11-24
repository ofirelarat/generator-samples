import fetch from 'node-fetch';

const delayed = (milisecond) => new Promise((resolve,_) => setTimeout(()=> resolve(), milisecond))

const transformGenerator = (mapper) => 
    async function* (iterator) {
        for await (const item of iterator){
            yield mapper(item)
        }
    }

async function* httpJsonGenerator(iterator) {
    for await (const url of iterator){
        const res = await fetch(url);
        const data = await res.json();

        yield data
    }
}

const urlToUrlGenerator = (url) => function* () {
    while(true){
        yield url;
    }
};

(async () => {
    const urlGenerator = urlToUrlGenerator('https://api.quotable.io/random')()
    const mapperGenerator = transformGenerator((item) => `${item.content} [${item.author}]`)
    const delayGenerator = transformGenerator(async (item) => await delayed(1000) || item)

    const asyncDataGenerator = delayGenerator(mapperGenerator(httpJsonGenerator(urlGenerator)));
    
    for await (const value of asyncDataGenerator) {
        console.log(value);
    }
})();
