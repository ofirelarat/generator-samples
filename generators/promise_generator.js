import fetch from 'node-fetch';


function promiseGenerator(generator){
    const iterator = generator()
    const nextIteration = iterator.next()

    const PromiseIteration = (iteration) => {
        const promise = iteration.value
        if(!iteration.done){
            promise.then(res => PromiseIteration(iterator.next(res)))
        } else {
            return promise
        }
    }

    return PromiseIteration(nextIteration)
}

(() => {
    promiseGenerator(
        function* () {
            const res = yield fetch('https://api.quotable.io/random')
            const data = yield res.json()

            console.log(data)
        })
})();