import fetch from 'node-fetch';

const transformGenerator = (mapper) =>
    async function* (iterator) {
        const item = await iterator.next()
        yield mapper(item.value)
    }

async function* httpJsonGenerator(url) {
    const res = await fetch(url);
    const data = await res.json();

    yield data
}

(async () => {
    const mapperGenerator = transformGenerator((data) => `${data.content} [${data.author}]`)
    const asyncDataGenerator = mapperGenerator(httpJsonGenerator('https://api.quotable.io/random'));
    const value = await asyncDataGenerator.next()
    console.log(value.value);
})();