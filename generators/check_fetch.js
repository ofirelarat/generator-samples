import fetch from 'node-fetch';

const transformGenerator = (mapper) =>
    async function* (iterator) {
        const item = await iterator.next
        yield mapper(item.value)
    }

async function* httpJsonGenerator(iterator) {
    const item = await iterator.next;
    const res = await fetch(item.value);
    const data = await res.json();

    yield data
}

const urlToUrlGenerator = (url) => function* () {
    yield url;
};

(async () => {
    const urlGenerator = urlToUrlGenerator('https://api.quotable.io/random')()
    const mapperGenerator = transformGenerator((data) => `${data.content} [${data.author}]`)

    const asyncDataGenerator = mapperGenerator(httpJsonGenerator(urlGenerator));
    
    const value = await asyncDataGenerator.next
    console.log(value.value);
})();