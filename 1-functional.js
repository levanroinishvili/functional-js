/**
 * Functional Programming basics
 * @author Levan Roinishvili
 */

// Intro, Halting problem
// λ-calculus, Alonzo Church, Alan Turing, Haskell Brooks Curry
// imperative vs declarative
// composable style


// --------------------------------------------------------------------------
function isPrime(n) {
    for ( let i = 2; i * i <= n; ++i )
        if ( n % i === 0 ) return false;
    return 1 < n;
}
function showPrimes(min = 1, max = 2e6) {
    for ( let n = min; n <= max; ++n ) {
        if ( isPrime(n) ) console.log(n)
    }
}
// --------------------------------------------------------------------------

// Functions are fist-class citizens
// Assignment of functions
const zero = () => 0;
const one = zero;
// Passing functions as arguments
function demo(f) {
    for ( let i = 0; i < 10; ++i)
        console.log(f.name, ':  ', i, ' => ', f(i))
}

// Closure
function memorize(n) {
    return function recall() {
        console.log('I memorized', n);
    }
}


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
