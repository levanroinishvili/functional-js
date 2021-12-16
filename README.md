# Functional Programming

## Purpose

These snippets were created specifically for [IliaUni](https://iliauni.edu.ge/) programming club [presentation](https://iliauni.edu.ge/en/iliauni/AcademicDepartments/bte/siaxleebi-273/programming-club-of-computing-center-at-iliaunifunctional-programming-in-javascript.page).

## The Plan

We will briefly look at some of the basic ideas in [Functional Programming](https://en.wikipedia.org/wiki/Functional_programming).
We may use simple snippets in the file `1-functional.js`
Then we will try to see Functional Programming in action. Perhaps with Promises and Observables.

## Using Code Snippets

The snippets were written to be executable within the browser console.

Open the `0-sandbox.html` file in the browser and open the console.
Some of the most basic snippets are available in file `1-functional.js`, which can be copy/pasted into the browser console.

### Available functionality

1. [Reactive Extensions for JavaScript](https://github.com/ReactiveX/rxjs) (`RxJs`) from Microsoft should automatically load
   * Originally I wrote a small mock class to recreate basic behaviour of RxJs, but later decided to include actual code from Microsoft
   * The mock classes are still included
2. Function `curry(f)` converts regular functions to [curried functions](https://en.wikipedia.org/wiki/Currying)
3. Function `show(message: string, clear = true)` puts messages on the page
   * `show()` is a curried function
   * Usage: `show('Hello')` or `show('Hello', false)`
4. You can test if your code on the page is blocking or non-blocking. Do so by clicking the button
5. Function `primesAsync()` will asynchronously load prime numbers from an API (via CORS proxy). Returns a Promise
   * Sample usage: `primesAsync().then(console.log)`
6. Function `primes$()` will return a stream of primes
   * Sample usage: `primes$().subscribe(console.log, console.warn, console.log.bind(console, '%cDone', 'color:red'));`


## Examples

For these examples, turn on the `Non-Blocking Test` by clicking the button on the page.

### Getting primes Synchronous

### Get primes in the console

```javascript
primes$().subscribe(
  console.log,
  console.warn,
  console.log.bind(console, '%cDone', 'color:red')
)
```

### Get primes on the page

```javascript
// Get primes on the page - (Turn on non-blocking test to confirm that script is non-blocking)
concat(
    of(null).pipe(tap(show('Getting primes')), ignoreElements()),
    primes$(1000, 500).pipe(take(10)),
    of('No More Primes ;)')
).subscribe(show(_, false) /* curried function */, console.warn)

```
