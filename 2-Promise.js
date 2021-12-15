// ------------------------------- Synchronous -------------------------------
function isPrime(n) {
    if ( n < 0 ) n = -n;
    if ( n < 2 ) return false;
    for ( let i = 2; i ** 2 <= n; ++i )
        if (n % i === 0) return false;
    return true;
}

function nextPrime(n) {
    while ( ! isPrime(++n) );
    return n;
}

// ------------------------------- Asynchronous -------------------------------
/**
 * Asynchronously check if a number is a prime. Allows cancellation
 * @param {n}: an integer to check for primality
 * @return {promise: Promise<boolean>}
 * If number is not prime, the promise is rejected
 */
function isPrime(n) {
    function primeCheckStep(n, factor, resolve, reject) {
        if ( n % factor === 0 ) reject(false);
        ++factor ** 2 <= n ? setTimeout(primeCheckStep, undefined, n, factor, resolve, reject) : resolve(true);
    }
    if ( n < 0 ) n = -n;
    if ( n < 2 ) return Promise.reject(false);
    return new Promise((resolve, reject) => primeCheckStep(n, 2, resolve, reject));
}

/**
 * Asynchronously find next prime number. Allows cancellation.
 * @param n: The first integer to be checked will be n + 1
 * @return {promise: Promise<boolean>}
 * Promise is rejected when number cannot be meaningfully incremented
*/
function nextPrime(delay = 5000) {
    return function(n) {
        function nextPrimeCheck(n, resolve, reject) {
            isPrime(n).then(
                () => resolve(n),
                () => n+1-1!==n ? reject('No more integers ;) after ' + n) : setTimeout(nextPrimeCheck, undefined, n+1, resolve, reject)
            );
        }
        return new Promise((resolve, reject) => setTimeout(nextPrimeCheck, delay, n+1, resolve, reject));
    };
}
