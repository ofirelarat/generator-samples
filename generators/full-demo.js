import fetch from 'node-fetch';

const delayed = (milisecond) => new Promise((resolve,_) => setTimeout(()=> resolve(), milisecond))

const filterGenerator = (predicate) => 
    async function* (iterator) {
        for await (const item of iterator){
            if(predicate(item)) yield item
        }
    }

const breakGenerator = (predicate) =>
    async function* (iterator) {
        for await (const item of iterator){
            yield item
            if(predicate(item)) break;
        }
    }

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
    const breakableGenerator = breakGenerator((item) => item.author === 'Mark Twain')
    const filteredGenerator = filterGenerator((item) => item.author === 'Albert Einstein')
    const mapperGenerator = transformGenerator((item) => `${item.content} [${item.author}]`)
    const delayGenerator = transformGenerator(async (item) => await delayed(1000) || item)

    const asyncDataGenerator = delayGenerator(mapperGenerator(filteredGenerator(breakableGenerator(httpJsonGenerator(urlGenerator)))));
    
    for await (const value of asyncDataGenerator) {
        console.log(value);
    }
})();














// (async () => {
//   while(true){
//     const url = 'https://api.quotable.io/random'
//     const res = await fetch(url);
//     const data = await res.json();

//     console.log(`${data.content} [${data.author}]`)
//     if(data.author === 'Mark Twain') break;
//     await delayed(1000)
//   }
// })();
