
/** @author: Levan Roinishvili */
function take(maxEmissions) {
    return function(source) {
        if ( maxEmissions < 1 ) return EMPTY;
        return new Observable(o => {
            let emissions = 0;
            var /* must be var, not const or let */ subscription = source.subscribe({
                next(...val) { o.next(...val); if ( ++emissions >= maxEmissions ) {subscription?.unsubscribe(); o.complete();} },
                error: o.error,
                complete: o.complete
            });
            // if ( emissions >= maxEmissions ) subscription.unsubscribe(); // If this happend synchronously
            return function taredown() { subscription.unsubscribe() }
        })
    }
}

function tap(next, error, complete) {
    return function(source) {
        return new Observable(o => {
            const subscription = source.subscribe({
                next(...val) { next(...val); o.next(...val); },
                error(...err) { error(...err); o.error(...err); subscription.unsubscribe(); },
                complete(...none) { complete(...none); o.complete(...none); subscription.unsubscribe(); }
            });
            return function taredown() { subscription.unsubscribe(); }
        })
    }
}

function map(predicate) {
    return function(source) {
        return new Observable(o => {
            const subscription = source.subscribe({
                next(...val) {
                    let success = false, mapped;
                    try {
                        mapped = predicate(...val);
                        success = true;
                    } catch(e) {
                        o.error(e);
                    }
                    if ( ! success ) o.next(mapped);
                },
                error: o.error,
                complete: o.complete
            })
            return function taredown() { subscription.unsubscribe() }
        })
    }
}
