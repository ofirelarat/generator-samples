
function* getSomeNumbers() {
    yield 1
    yield 2
    yield 3
}

(() => {
    for(const number of getSomeNumbers()){
        console.log(number);
    }
})();