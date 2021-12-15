/**
 * Demonstrating simple ideas around Reactive Programming
 * @author: Levan Roinishvili
 *
 */

/** A stub @class Subscription. @author: Levan Roinishvili  */
class Subscription {
    state = 0; // 0 : open;  -1 : error;  +1 : complete;  +2 : unsubscribed
    get closed() {return ! this.state}
    constructor(next, error, complete, observableFactory) {
        this.destination = {
            next: (...val) => { ! this.state ? next?.(...val) : undefined },
            error: (...err) => { ! this.state ? (this.state = -1, error?.(...err), taredown?.()): undefined },
            complete: (...none) => { ! this.state ? (this.state = +1, complete?.(...none), taredown?.()) : undefined }
        }
        let taredown; // Taredown function - must be declared before next line calls observableFactory - in case synchronous error or complete
        const taredownRaw = observableFactory(this.destination)
        taredown = typeof taredownRaw === 'function' ? taredownRaw : () => void 0;
        switch ( this.state ) { // Take care of synchronous error and completion - taredown was not yet available when they occured
            case -1:
            case +1: taredown();
        }
        this.unsubscribe = () => {
            if ( ! this.state ) {
                this.state = +2;
                taredown();
            }
        }
    }
}

/** A stub @class Observable. @author: Levan Roinishvili */
class Observable {
    constructor(observableFactory) {
        this.observableFactory = observableFactory;
    }

    pipe(...operators) {
        return operators.reduce((stream, operator) => operator(stream), this)
    }

    subscribe(next = ()=>undefined, error = ()=>undefined, complete = ()=>undefined) {
        return next && typeof next === 'object'
            ? new Subscription(next.next, next.error, next.complete, this.observableFactory)
            : new Subscription(next, error, complete, this.observableFactory)
    }
}

// -------------------------------------------------------- Generate Primes asynchronously --------------------------------------------------------

/**
 * Asynchronously check if a number is a prime. Allows cancellation
 * @param {n}: an integer to check for primality
 * @return {{promise: Promise<boolean>, cancel: Function}}
 * If number is not prime, the promise is rejected
 */
function isPrime(n) {
    let schedule;
    const cancel = () => clearTimeout(schedule);

    function primeCheckStep(n, factor, resolve, reject) {
        if ( n % factor === 0 ) reject(false);
        else ++factor ** 2 <= n ? schedule = setTimeout(primeCheckStep, undefined, n, factor, resolve, reject) : resolve(true);
    }
    if ( n < 0 ) n = -n;
    if ( n < 2 ) return {promise: Promise.reject(false), cancel: () => void 0}
    if ( n === 2) return {promise: Promise.resolve(true), cancel: () => void 0}
    return {
        promise: new Promise((resolve, reject) => primeCheckStep(n, 2, resolve, reject)),
        cancel
    };
}

/**
 * Asynchronously find next prime number. Allows cancellation.
 * @param n: The first integer to be checked will be n + 1
 * @return {{promise: Promise<boolean>, cancel: Function}}
 * Promise is rejected when number cannot be meaningfully incremented
*/
function nextPrime(n) {
    let schedule; // timeout for the next task, if already scheduled
    let cancelCurrentTask = () => clearTimeout(schedule);
    let cancelSubTask;
    const cancel = () => {
        cancelCurrentTask();
        cancelSubTask?.();
    }

    function nextPrimeFindStep(n, resolve, reject) {
        const {promise: isPrimePromise, cancel: cancelPrimeCheck} = isPrime(n);
        cancelSubTask = cancelPrimeCheck;
        isPrimePromise.then(
            () => resolve(n),
            () => n+1-1!==n ? reject('No more integers ;) after ' + n) : schedule = setTimeout((...args) => nextPrimeFindStep(...args), undefined, n+1, resolve, reject)
        )
    }

    return {
        promise: new Promise((resolve, reject) => nextPrimeFindStep(n+1, resolve, reject)),
        cancel
    }
}

/** Create stream of primes
 * @author: Levan Roinishvili
 * @param from: The first number to check for primality. All subsequent numbers will potentially be checked
 * @param delay:
 */
function primes(from = 0, delay = 5000) {
    return new Observable(o => {
        let cancelSubtask; // function : to cancel ongoing prime search
        let timeout; // integer : to cancel future scheduled prime search
        let noMore;
        function taredown() { // Taredown this observable
            cancelSubtask?.()
            clearTimeout(timeout)
            noMore = true;
        }
        function findPrimeAfter(from) {
            timeout = setTimeout(
                (from) => {
                    const {promise, cancel} = nextPrime(from)
                    cancelSubtask = cancel
                    promise.then(
                        prime => {o.next(prime); if ( ! noMore ) findPrimeAfter(prime)},
                        o.error
                    )
                },
                delay,
                from
            )
        }
        findPrimeAfter(from - 1)

        return taredown
    })
}


// Test by:
//         const subscription = primes().subscribe(console.log.bind(console, 'Found a prime'))
// To stop:
//         subscription.unsubscribe();


// ------------------------------------------ EXTRA ------------------------------------------
const EMPTY = new Observable(o => o.complete())
const NEVER = new Observable(o => void 0)
