/*
 * zwiper.core.js
 * Created by: Ruud Voost
 * Summary: Default instance of a zwiper
 */

/*jslint browser: true, devel: true */

var ZWIPER = this.Object || {};

// Zwiper Core Functionality
ZWIPER.core = function () {
    "use strict";
    
    // Default zwiper settings. Can be overwritten
    var zwiperDefaults;
    zwiperDefaults = {
        container: '.zwiper-container',
        slide: '.zwiper-slide',
        duration: '.6s'
    };
    
    // check user set settings, overwrite defaults if necessary
    function checkUserSettings(userSettings) {
        var zwiperSettings;
        // If type is string, it must be the container class/id
        if (typeof userSettings === 'string') {
            // Overwrite zwiperSettings default container with user set container
            zwiperSettings = zwiperDefaults;
            zwiperSettings.container = userSettings;
        } else {
            // Keep defaults
            zwiperSettings = zwiperDefaults;
        }
        return zwiperSettings;
    }
    
    // initialize a zwiper
    function zwiper(userSettings) {
        // declare used vars
        var zwiperObj, zwiperContainer, zwiperContainerHtml, zwiperWrapper, zwiperContainerWidth, zwiperSlides, i, clicks, zwiperSettings;
        
        // check userSettings
        zwiperSettings = checkUserSettings(userSettings);
        
        // retrieve container and store in zwiperContainer var
        zwiperContainer = document.getElementsByClassName(zwiperSettings.container)[0];
        zwiperContainer.setAttribute('style', 'overflow: hidden;');
        
        // create wrapper that serves as the sliding element
        zwiperContainerHtml = zwiperContainer.innerHTML;
        zwiperContainer.innerHTML = '<div class="zwiper-wrapper">' + zwiperContainerHtml + '</div>';
        // retrieve newly created wrapper and store in zwiperWrapper var
        zwiperWrapper = document.getElementsByClassName('zwiper-wrapper');
        zwiperWrapper = zwiperWrapper[0];
        
        // get width and store in zwiperContainerWidth var
        zwiperContainerWidth = parseInt(window.getComputedStyle(zwiperContainer, null).getPropertyValue('width'), 10);
        console.log('zwiperContainerWidth: ', zwiperContainerWidth);
        
        // retrieve nr of slides store zwiperSlides var
        zwiperSlides = document.getElementsByClassName('zwiper-slide');
        
        // set width for each of the slides
        for (i = 0; i < zwiperSlides.length; i += 1) {
            zwiperSlides[i].setAttribute('style', 'width: ' + zwiperContainerWidth + 'px;');
        }
        
        // wrapper is container width * nr of slides
        zwiperWrapper.setAttribute('style', 'width: ' + (zwiperContainerWidth * zwiperSlides.length) + 'px;');
        
        clicks = 0;
        zwiperWrapper.addEventListener('click', function (e) {
            clicks += 1;
            if (clicks < zwiperSlides.length) {
                this.style.webkitTransform = 'translate3D(-' + (zwiperContainerWidth * clicks) + 'px, 0, 0)';
                console.log('Nr of swipes', clicks);
            } else {
                console.log('no more slides to show!');
            }
        });
        
    }
    
    /*
     * Public Init
     */
    
    return {
        zwiper: function (something) {
            zwiper(something);
        }
    };
};