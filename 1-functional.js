/**
 * Functional Programming basics
 * @author Levan Roinishvili
 */

// Intro, Halting problem
// λ-calculus, Alonzo Church, Alan Turing, Haskell Brooks Curry
// imperative vs declarative
// composable style

// FYI: I will use two notations for functions in JavaScript

// λ-calculus
// Functions are unary (arity of 1) | Practical usage: Curried functions. example ideas: ages
// Closure

// I, M, I(I), M(M) - halting problem


// --------------------------------------------------------------------------
function isPrime(n) {
    for ( let i = 2; i * i <= n; ++i )
        if ( n % i === 0 ) return false;
    return 1 < n;
}
/** Not a pure function */
function countPrimes(min = 1, max = 7e6) {
    let count = 0;
    for ( let n = min; n <= max; ++n ) {
        count += isPrime(n)
    }
    return count
}

countPrimes(1, 100)

// More functional
function counter(from, to, f) {
    let count = 0
    for (let i = from; i <= to; ++i) {
        count += f(i)
    }
    return count
}

counter(1, 100, isPrime)

function makeCounterFrom(f) {
    return function(min, max) {
        let count = 0;
        for ( let i = min; i <= max; ++i )
            count += f(i)
        return count
    }
}

const countPrimes = makeCounterFrom(isPrime)
// --------------------------------------------------------------------------

// Functions are fist-class citizens
// Assignment of functions
const Kzero = () => 0;
const Kx = zero;
// Passing functions as arguments
function demo(f) {
    for ( let i = 0; i < 10; ++i)
        console.log(f.name, ':  ', i, ' => ', f(i))
}


function memorize(f, keymaker = JSON.stringify) {
    const cache = {}

    return function(...args) {
        const key = keymaker.call(null, args)
        return key in cache ? cache[key] : cache[key] = f(...args)
    }
}

function memorize(f, keymaker = JSON.stringify) {
    const cache = {}

    return function(...args) {
        const key = keymaker.call(null, args)
        if ( key in cache ) {
            console.log('%cCache hit for', 'color:green', key)
            return cache[key]
        } else {
            console.log('%cCache missed for', 'color:red', key)
            return cache[key] = f(...args)
        }
    }
}

function memorizedCurried(f, curry = curry, keymaker = JSON.stringify) {
    const cache = {}
    const curried = curry(f)
    function maker(prevArgs, f) {
        return function (nextArg) {
            const args = [...prevArgs, nextArg]
            const key = keymaker.apply(null, args)
            if ( key in cache ) {
                console.log('%cCache hit for', 'color:green', key)
                return cache[key]
            } else {
                const result = f(...args)
                if ( typeof result === 'function' ) return maker(args, result)
                else {
                    console.log('%cCache missed for', 'color:red', key)
                    return cache[key] = result
                }
            }
        }
    }
    return maker([], curried)
}

mockingbird = f => (...args) => f(f, ...args)

function f(k) {
    return function (x) {
        const sum = k + x
        return sum
    }
}

const g = f(17)  // returns a function

g(1) // returns 18
g(10) // returns 28

// Pure, stateless

/** This is an example of a stateful function */
function runNo() {
    runNo.runs = runNo.runs ?? 0;
    ++runNo.runs;
    console.log('I am running for the', runNo.runs, 'times');
}

/** This is an example of an impure function */
function username() {
    return prompt('What is your name?')
}

// Addition and subtraction
add = (x, y) => x + y;
sub = (x, y) => x - y;

/** Addition (impure) which sometimes returns an incorrect value */
add = (x, y) => x + y + (Math.random() < 0.1)

/** This function tests addition function */
function additionTester(add, testCount = 10) {
    for ( let i=0; i<testCount; ++i) {
        const [a, b] = new Array(2).fill().map(_ => Math.floor(Math.random()*1000));
        const sumTest = add(a, b), sumReal = a + b;
        const testPrompt = `Testing ${a} + ${b} = ${sumReal}`;
        const [icon, testReply] = sumTest === sumReal ? ['✅',''] : ['⛔', `(${sumTest})`];
        console.log(icon, testPrompt, testReply);
        if ( sumTest !== sumReal ) break;
    }
}

const AdditionTests = [
    {params: [1,2], result: 3},
    {params: [7,2], result: 9},
    {params: [9,3], result: 12},
    {params: [7,8], result: 15},
    {params: [10,12], result: 22},
    {params: [0,102], result: 102},
]
function tester(f, tests) {
    return tests.every(({params, result}) => {
        const realResult = f(...params)
        if ( realResult === result ) {
            console.log(`✅ ${f.name}(${params.join(', ')}) = ${result}`)
            return true
        } else {
            console.log(`⛔ ${f.name}(${params.join(', ')}) should be ${result} %c(Function returned ${realResult})`, 'color:yellow')
            return false
        }
    })
}

/** This function makes another function "polite" */
function polite(f) {
    if ( typeof f !== 'function' ) throw new Error('Hey, I only take functions!');
    return function(...args) {
        console.log('Hi! My name is', f.name);
        console.log('I received', args.join(', '));
        console.log('My reply is', f(...args));
    }
}


/**
 * @return composition of two functions
 */
function compose(f, g) {
    return function(...args) {
        return f(g(...args));
    }
}


/** Capitalizes the first char of a string */
capitalizeFirst = word => word ? word[0].toUpperCase() + word.slice(1) : word;

/** Titlecases a sentence */
titleCase = sentence => sentence
    .split(' ')
    .filter(word => word)
    .map(capitalizeFirst)
    .join(' ')

// Let's try this out
titleCase('   hello    my friend,   how are  you?  ')

// map: increment
// filter: lessThan5
// reduce
// sort
