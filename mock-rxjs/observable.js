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

const EMPTY = new Observable(o => o.complete())
const NEVER = new Observable(o => void 0)
