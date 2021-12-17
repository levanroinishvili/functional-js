
function time(f, ...args) {
    if ( typeof f !== 'function' ) {
        console.log('%cError: %cFirst parameter is not a function.\n    %cUsage: %ctime(f, arg1, arg2, ...)', 'color: red', 'color:yellow', '', 'color:lightgreen')
        return
    }
    const startTime = new Date();
    const result = f(...args);
    const endTime = new Date();
    const duration = (endTime - startTime);
    if ( duration < 1000 ) console.log('Time taken:', duration, 'milliseconds')
    else console.log('Time taken', duration / 1000, 'seconds');
    return result;
}
