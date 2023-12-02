const persons = [{age: 15, name: 'ofir'}, {age: 19, name: 'ofir2'},{age: 27, name: 'ofir3'}]

const isAdultPredicate = (person) => {
    return person.age > 18
}

const personToString = (person) => {
    return person.name
}

const printAllMaturePersons = () => {
    const results = persons.filter(x => isAdultPredicate(x)).map(x => personToString(x))
    for(const item of results){
        console.log(item)
    }
}

// printAllMaturePersons()

const curringMap = mapper => 
    function* GeneratorMap(iterator){
        for(const item of iterator){
            yield mapper(item)
        }
    }

const curringFilter = filter => 
    function* GeneratorFilter(iterator){
        for(const item of iterator){
            if(filter(item)){
                yield item
            }
        }
    }

const printAllMaturePersonsIterators = () => {
    const results = curringMap(personToString)(curringFilter(isAdultPredicate)(persons))
    for(const item of results){
        console.log(item)
    }
}

// printAllMaturePersonsIterators()