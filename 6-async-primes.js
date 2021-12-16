
/** get primes from remote API */
function primesAsync(upto = 1e6) {
    const primesApiUrl = `https://sethriedel.com/primes/api/primes.php?limit=${upto}`
    const corsProxyUrl = 'https://api.codetabs.com/v1/proxy/?quest=' + primesApiUrl;
    return fetch(corsProxyUrl).then(response => response.json()).then(reply => reply.primes)
}

/**
 * Asynchronously check if a number is a prime. Allows cancellation
 * @param {n}: an integer to check for primality
 * @return {{promise: Promise<boolean>, cancel: Function}}
 * If number is not prime, the promise is rejected
 */
 function isPrimeAsync(n) {
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
function nextPrimeAsync(n) {
    let schedule; // timeout for the next task, if already scheduled
    let cancelCurrentTask = () => clearTimeout(schedule);
    let cancelSubTask;
    const cancel = () => {
        cancelCurrentTask();
        cancelSubTask?.();
    }

    function nextPrimeFindStep(n, resolve, reject) {
        const {promise: isPrimePromise, cancel: cancelPrimeCheck} = isPrimeAsync(n);
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
function primes$(from = 0, delay = 2000) {
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
                    const {promise, cancel} = nextPrimeAsync(from)
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