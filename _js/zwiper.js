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
    // declare used vars
    var zwiperContainer, zwiperContainerHtml, zwiperWrapper, zwiperContainerWidth, zwiperSlides, i;
    
    console.log('ready to rumble!');
    
    zwiperContainer = document.getElementsByClassName('zwiper-container');
    zwiperContainer = zwiperContainer[0];
    console.log(zwiperContainer);
    
    zwiperContainerHtml = zwiperContainer.innerHTML;
    zwiperContainer.innerHTML = '<div class="zwiper-wrapper">' + zwiperContainerHtml + '</div>';
    
    zwiperWrapper = document.getElementsByClassName('zwiper-wrapper');
    zwiperWrapper = zwiperWrapper[0];
    
    console.log(zwiperContainer);
    
    zwiperContainerWidth = parseInt(window.getComputedStyle(zwiperContainer, null).getPropertyValue('width'), 10);
    console.log('zwiperContainerWidth: ');
    console.log(zwiperContainerWidth);
    
    zwiperSlides = document.getElementsByClassName('zwiper-slide');
    
    for (i = 0; i < zwiperSlides.length; i += 1) {
        zwiperSlides[i].setAttribute('style', 'width: ' + zwiperContainerWidth + 'px;');
    }
    
    zwiperWrapper.setAttribute('style', 'width: ' + (zwiperContainerWidth * 3) + 'px;');
}