# Functional Programming

<img src="http://axisapplications.com/wp-content/uploads/2019/02/functionalprogramming_icon-300x300.png" width="96">

There are many excellent tutorials on the internet discussing Functional Programming. Thus, it is perhaps counter counterproductive
to follow the traditional path discussing this topic. Instead, we will try to focus on aspects of Functional Programming as it is
used by modern web applications developer.

## Purpose

These snippets were created specifically for the [presentation](https://iliauni.edu.ge/en/iliauni/AcademicDepartments/bte/siaxleebi-273/programming-club-of-computing-center-at-iliaunifunctional-programming-in-javascript.page) to the  [programming club](https://iliauni.edu.ge/en/iliauni/AcademicDepartments/bte/siaxleebi-273/series-of-meetings-of-the-programming-club-of-computing-center-at-iliauni.page) at [IliaUni](https://iliauni.edu.ge/).

These snippets do not require any framework, complication, or any dependencies not included.

## Dependencies

<img src="https://rxjs.dev/generated/images/marketing/home/Rx_Logo-512-512.png" alt="drawing" width="64"/>

To demonstrate how Functional Style is used with Reactive Programming, I initially decided to mock some of the basic behaviours
of Microsoft's Reactive Extensions library. These mocks are still available in this repo and could be used for demonstration.
However, I later decided to include the actual Reactive Extensions from Microsoft, in case we need more functionality during
the presentation. Microsoft's library should be automatically loaded in the brower, once the included html file is opened.

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

### Computing Primes Synchronously

This is trivial, so we may try to quickly set up a routine to do it and observe if the resulting code will be blocking or non-blocking.

### Computing Primes Asynchronously, non-blocking

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
    primes$(1e5 /* start from */, 0 /* delay */).pipe(take(10)),
    of('No More Primes ;)')
).subscribe(show(_, false) /* curried function */, console.warn)

```
