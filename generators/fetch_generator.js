import fetch from 'node-fetch';

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
    yield url;
};

(async () => {
    const urlGenerator = urlToUrlGenerator('https://api.quotable.io/random')()
    const mapperGenerator = transformGenerator((data) => `${data.content} [${data.author}]`)

    const asyncDataGenerator = mapperGenerator(httpJsonGenerator(urlGenerator));
    
    for await (const value of asyncDataGenerator) {
        console.log(value);
    }
})();