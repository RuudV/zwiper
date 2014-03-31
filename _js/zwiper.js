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
    var zwiperDefaults, zwiperObj, zwiperContainer, zwiperContainerHtml, zwiperWrapper, zwiperContainerWidth, zwiperSlides, i, clicks, zwiperSettings = {}, objProp, transformWithPref, transitionDurationWithPref, transitionTimingFunctionWithPref, prefixProp = {}, JSLintShutUp;

    // Default zwiper settings. Can be overwritten
    zwiperDefaults = {
        container: 'zwiper-container',
        slide: 'zwiper-slide',
        height: undefined,
        width: undefined,
        transitionDuration: undefined,
        transitionTiming: 'zwiper-ease-in-out'
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
    // Detect which property to use (prefixed css properties only)
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
    transformWithPref = ['transform', 'WebkitTransform', 'MozTransform', 'msTransform'];
    transitionDurationWithPref = ['transitionDuration', 'WebkitTransitionDuration', 'MozTransitionDuration', 'msTransitionDuration'];
    transitionTimingFunctionWithPref = ['transitionTimingFunction', 'WebkitTransitionTimingFunction', 'MozTransitionTimingFunction', 'msTransitionTimingFunction'];
    prefixProp.transform = getSupportedPropertyName(transformWithPref);
    prefixProp.transitionDuration = getSupportedPropertyName(transitionDurationWithPref);
    prefixProp.transitionTimingFunction = getSupportedPropertyName(transitionTimingFunctionWithPref);
    console.log(prefixProp.transform, prefixProp.transitionDuration, prefixProp.transitionTimingFunction);

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
    zwiperContainer.style.overflow = 'hidden';

    // get width and store in zwiperContainerWidth var
    if (zwiperSettings.width === undefined) {
        zwiperContainerWidth = parseInt(zwiperContainer.offsetWidth, 10);
        zwiperContainer.style.width = zwiperContainerWidth + 'px';
        console.log(zwiperContainerWidth);
    } else if (zwiperSettings.width.indexOf('px') !== -1) {
        zwiperContainerWidth = parseInt(zwiperSettings.width.replace('px', ''), 10);
        zwiperContainer.style.width = zwiperContainerWidth + 'px';
        console.log(zwiperContainerWidth);
    } else if (zwiperSettings.width.indexOf('%') !== -1) {
        zwiperContainer.style.width = zwiperSettings.width;
        zwiperContainerWidth = zwiperContainer.offsetWidth;
        console.log(zwiperContainerWidth);
    } else {
        zwiperContainerWidth = parseInt(zwiperSettings.width, 10);
        zwiperContainer.style.width = zwiperContainerWidth + 'px';
        console.log(zwiperContainerWidth);
    }

    // create wrapper that serves as the sliding element
    zwiperContainerHtml = zwiperContainer.innerHTML;
    zwiperContainer.innerHTML = '<div class="zwiper-wrapper">' + zwiperContainerHtml + '</div>';
    // retrieve newly created wrapper and store in zwiperWrapper var
    zwiperWrapper = zwiperContainer.getElementsByClassName('zwiper-wrapper')[0];

    // retrieve nr of slides store zwiperSlides var
    zwiperSlides = zwiperContainer.getElementsByClassName(zwiperSettings.slide);
    console.log('zwiperSlides', zwiperSlides.length);

    // set width for each of the slides
    for (i = 0; i < zwiperSlides.length; i += 1) {
        zwiperSlides[i].setAttribute('style', 'width: ' + zwiperContainerWidth + 'px;');
    }

    // wrapper is container width * nr of slides
    zwiperWrapper.setAttribute('style', 'width: ' + (zwiperContainerWidth * zwiperSlides.length) + 'px;');
    zwiperWrapper.style[prefixProp.transform] = 'translate3D(0,0,0)';

    // set transition timing
    if (zwiperSettings.transitionDuration === 'zwiper-ease-in-out') {
        // TODO, not going to be empty!
        JSLintShutUp = 'shut it!';
    }
    // set transition duration
    if (zwiperSettings.transitionDuration !== undefined) {
        zwiperWrapper.style[prefixProp.transitionDuration] = zwiperSettings.transitionDuration;
    }

    // ****
    // Add method nextSlide() to transition to next slide
    // ****
    this.nextSlide = function () {
        var distanceLeft, activeSlide, newDistance;
        distanceLeft = translate3DToObject(zwiperWrapper.style[prefixProp.transform]).x * -1;
        console.log('offset!', distanceLeft);
        activeSlide = (distanceLeft / zwiperContainerWidth) + 1;
        console.log('distance left', distanceLeft, 'active slide', activeSlide);

        if (distanceLeft === parseInt(window.getComputedStyle(zwiperWrapper, null).getPropertyValue('width'), 10) - zwiperContainerWidth) {
            newDistance = 0;
        } else {
            newDistance = distanceLeft + zwiperContainerWidth;
        }
        console.log('newDistance', newDistance);

        zwiperWrapper.style[prefixProp.transform] = 'translate3D(' + newDistance * -1 + 'px, 0, 0)';
    };

    // ****
    // Add method prevSlide() to transition to previous slide
    // ****
    this.prevSlide = function () {
        var distanceLeft, activeSlide, newDistance;
        distanceLeft = translate3DToObject(zwiperWrapper.style[prefixProp.transform]).x * -1;
        console.log('offset!', distanceLeft);
        activeSlide = (distanceLeft / zwiperContainerWidth) + 1;
        console.log('distance left', distanceLeft, 'active slide', activeSlide);

        if (distanceLeft === 0) {
            newDistance = zwiperContainerWidth * (zwiperSlides.length - 1);
        } else {
            newDistance = distanceLeft - zwiperContainerWidth;
        }
        console.log('newDistance', newDistance);

        zwiperWrapper.style[prefixProp.transform] = 'translate3D(' + newDistance * -1 + 'px, 0, 0)';
    };

    // ****
    // Append active slide class current slide in view and remove from if applied to other slide
    // ****
    function setActiveSlide() {
        // TODO: Start and finish this
    }

}; // end zwiper