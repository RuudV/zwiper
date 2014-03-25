/*
 * zwiper.js
 * Created by: Ruud Voost
 * Summary: Zwiper initializer
 */

/*jslint browser: true, devel: true */

var zwiper = this.Object || {};
zwiper = function (userSettings) {
    "use strict";
    
    // vars!
    var zwiperDefaults, zwiperObj, zwiperContainer, zwiperContainerHtml, zwiperWrapper, zwiperContainerWidth, zwiperSlides, i, clicks, zwiperSettings = {};
    
    // Default zwiper settings. Can be overwritten
    zwiperDefaults = {
        container: 'zwiper-container',
        slide: 'zwiper-slide'
    };
    
    // check user set settings, overwrite defaults if necessary
    function setSettings(userSettings) {
        var zwiperSettings, objProp;
        // If type is string, it must be the container class/id
        if (typeof userSettings === 'string') {
            // Overwrite zwiperSettings default container with user set container
            zwiperSettings = zwiperDefaults;
            zwiperSettings.container = userSettings;
        } else if (typeof userSettings === 'object') {
            console.log('userSettings object', userSettings);
            for (var objeProp in userSettings) { zwiperSettings[attrProp] = userSettings[objProp]; }
        } else {
            // Keep defaults
            zwiperSettings = zwiperDefaults;
        }
        return zwiperSettings;
    }
    
    // check userSettings
    zwiperSettings = setSettings(userSettings);
    console.log('zwiperSettings', zwiperSettings);
    
    // retrieve container and store in zwiperContainer var
    zwiperContainer = document.getElementsByClassName(zwiperSettings.container)[0];
    zwiperContainer.setAttribute('style', 'overflow: hidden; position: relative;');
    
    // create wrapper that serves as the sliding element
    zwiperContainerHtml = zwiperContainer.innerHTML;
    zwiperContainer.innerHTML = '<div class="zwiper-wrapper">' + zwiperContainerHtml + '</div>';
    // retrieve newly created wrapper and store in zwiperWrapper var
    zwiperWrapper = zwiperContainer.getElementsByClassName('zwiper-wrapper');
    zwiperWrapper = zwiperWrapper[0];
    
    // get width and store in zwiperContainerWidth var
    zwiperContainerWidth = parseInt(window.getComputedStyle(zwiperContainer, null).getPropertyValue('width'), 10);
    
    // retrieve nr of slides store zwiperSlides var
    zwiperSlides = zwiperContainer.getElementsByClassName(zwiperSettings.slide);
    console.log('zwiperSlides', zwiperSlides.length);
    
    // set width for each of the slides
    for (i = 0; i < zwiperSlides.length; i += 1) {
        zwiperSlides[i].setAttribute('style', 'width: ' + zwiperContainerWidth + 'px;');
    }
    
    // wrapper is container width * nr of slides
    zwiperWrapper.setAttribute('style', 'width: ' + (zwiperContainerWidth * zwiperSlides.length) + 'px;');
    
    // on click move the wrapper
    clicks = 0;
    zwiperWrapper.addEventListener('click', function (e) {
        clicks += 1;
        console.log('clicks', clicks);
        if (clicks < zwiperSlides.length) {
            this.style.WebkitTransform = 'translate3D(-' + (zwiperContainerWidth * clicks) + 'px, 0, 0)';
            this.style.MozTransform = 'translate3D(-' + (zwiperContainerWidth * clicks) + 'px, 0, 0)';
            console.log('Nr of swipes', clicks);
        } else {
            console.log('no more slides to show!');
        }
    });
    
    this.next = function () {
        console.log('zwiperWrapper position from left', zwiperWrapper.offsetLeft);
    };
    
    this.previous = function () {
        
    };
    
}; // end zwiper
