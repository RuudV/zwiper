/*
 * zwiper.js
 * Created by: Ruud Voost
 */

// set jslint vars to make sure no useless errors like 'console was used before it was defined' are popping up.
/*jslint browser: true*/
/*jslint devel: true*/

// uses an indentation of 4 spaces, which makes jslint shut up
// zwiper instance
function zwiper() {
    // use strict js to make sure all errors are catched.
    "use strict";
    var ready = 'Ready for lift off!';
    console.log(ready);
    document.getElementById('title').textContent = ready;
}