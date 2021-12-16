/**
 * Curry a function with definate arity. Meaningless for variadic functions
 * @author: Levan Roinishvili
 */
 const _ = curry = (f, placeholder = _) => {

    function makeCurried(oldArgs) {
        return function curried(...args) {
            const allArgs = oldArgs.slice();
            // Similar to Array.prototype.findIndex, but returns `arr.length` instead of `-1`
            const findIndex = (arr, predicate, offset=0) => {
                const i = offset + arr.slice(offset).findIndex(predicate);
                return i < offset ? arr.length : i;
            }
            // Fill in placeholders
            for (let i=0, j = findIndex(args, a=>a!==_); i < allArgs.length && j < args.length; ++i)
                if ( allArgs[i] === _ ) {
                    allArgs.splice(i, 1, args[j]);
                    args.splice(j, 1);
                    j=findIndex(args, a=>a!==_, j);
                }
            // Add all remaining args at the end of `AllArgs`
            allArgs.splice(allArgs.length, 0, ...args);
            // Check if arguments are enough
            const firstPlaceholderIndex = findIndex(allArgs, a => a === _);
            const enoughArgs = firstPlaceholderIndex >= f.length;

            return enoughArgs ? f.apply(null, allArgs) : makeCurried(allArgs);
        }
    }

    return makeCurried([]);
}
