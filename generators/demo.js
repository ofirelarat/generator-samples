import fetch from 'node-fetch';

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

    const asyncDataGenerator = httpJsonGenerator(urlGenerator);
    
    for await (const value of asyncDataGenerator) {
        console.log(value);
    }
})();
