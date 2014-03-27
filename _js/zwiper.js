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
    var zwiperDefaults, zwiperObj, zwiperContainer, zwiperContainerHtml, zwiperWrapper, zwiperContainerWidth, zwiperSlides, i, clicks, zwiperSettings = {}, objProp, transformWithPref, transform;
    
    // Default zwiper settings. Can be overwritten
    zwiperDefaults = {
        container: 'zwiper-container',
        slide: 'zwiper-slide'
    };
    
    // ****
    // Check user set settings, overwrite defaults if necessary
    // ****
    function setSettings(userSettings) {
        var zwiperSettings, objProp;
        // If type is string, it must be the container class/id
        if (typeof userSettings === 'string') {
            // Overwrite zwiperSettings default container with user set container
            zwiperSettings = zwiperDefaults;
            zwiperSettings.container = userSettings;
        } else if (typeof userSettings === 'object') {
            zwiperSettings = zwiperDefaults;
            for (objProp in userSettings) {
                if (userSettings.hasOwnProperty(objProp)) {
                    zwiperSettings[objProp] = userSettings[objProp];
                }
            }
        } else {
            // Keep defaults
            zwiperSettings = zwiperDefaults;
        }
        return zwiperSettings;
    }
    // check userSettings
    zwiperSettings = setSettings(userSettings);
    console.log('zwiperSettings', zwiperSettings);
    
    // ****
    // Detect which prefix to use
    // ****
    function getSupportedPropertyName(properties) {
        var i;
        for (i = 0; i < properties.length; i += 1) {
            if (typeof document.body.style[properties[i]] !== 'undefined') {
                return properties[i];
            }
        }
        return null;
    }
    transformWithPref = ['transform', 'msTransform', 'webkitTransform', 'mozTransform', 'oTransform'];
    transform = getSupportedPropertyName(transformWithPref);
    console.log(transform);
    
    // ****
    // Transform a translate3D string to an object x:pos, y:pos, z:pos;
    // ****
    function translate3DToObject(value) {
        value = value.toString();
        var pattern = /([0-9\-]+)+(?![3d]\()/gi,
            positionMatched = value.match(pattern);
        
        return {
            x: parseFloat(positionMatched[0]),
            y: parseFloat(positionMatched[1]),
            z: parseFloat(positionMatched[2])
        };
    }
    
    // retrieve container and store in zwiperContainer var
    zwiperContainer = document.getElementsByClassName(zwiperSettings.container)[0];
    zwiperContainer.setAttribute('style', 'overflow: hidden;');
    
    // create wrapper that serves as the sliding element
    zwiperContainerHtml = zwiperContainer.innerHTML;
    zwiperContainer.innerHTML = '<div class="zwiper-wrapper">' + zwiperContainerHtml + '</div>';
    // retrieve newly created wrapper and store in zwiperWrapper var
    zwiperWrapper = zwiperContainer.getElementsByClassName('zwiper-wrapper')[0];
    
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
    zwiperWrapper.style[transform] = 'translate3D(0,0,0)';
    
    
    
    // ****
    // Add method nextSlide() to transition to next slide
    // ****
    this.nextSlide = function () {
        var distanceLeft, activeSlide, newDistance;
        distanceLeft = translate3DToObject(zwiperWrapper.style[transform]).x * -1;
        console.log('offset!', distanceLeft);
        activeSlide = (distanceLeft / zwiperContainerWidth) + 1;
        console.log('distance left', distanceLeft, 'active slide', activeSlide);
        
        if (distanceLeft === parseInt(window.getComputedStyle(zwiperWrapper, null).getPropertyValue('width'), 10) - zwiperContainerWidth) {
            newDistance = 0;
            return newDistance;
        } else {
            newDistance = distanceLeft + zwiperContainerWidth;
        }
        
        zwiperWrapper.style[transform] = 'translate3D(' + newDistance * -1 + 'px, 0, 0)';
    };
    
    // ****
    // Add method prevSlide() to transition to previous slide
    // ****
    this.prevSlide = function () {
        var distanceLeft, activeSlide, newDistance;
        distanceLeft = translate3DToObject(zwiperWrapper.style[transform]).x * -1;
        console.log('offset!', distanceLeft);
        activeSlide = (distanceLeft / zwiperContainerWidth) + 1;
        console.log('distance left', distanceLeft, 'active slide', activeSlide);
        
        if (distanceLeft === 0) {
            newDistance = 0;
            return newDistance;
        } else {
            newDistance = distanceLeft - zwiperContainerWidth;
        }
        
        zwiperWrapper.style[transform] = 'translate3D(' + newDistance * -1 + 'px, 0, 0)';
    };
    
}; // end zwiper
