/*
 * zwiper.js
 * Created by: Ruud Voost
 * Summary: Zwiper initializer
 */

/*jslint browser: true, devel: true */

var zwiper = this.Object || {};
zwiper = function (userSettings) {
    "use strict";

    // *********************************************************************************
    // * HELPERS
    // *********************************************************************************

    // add a class to an element
    function addClass(element, className) {
        if (element.classList) {
            element.classList.add(className);
        } else {
            element.className += ' ' + className;
        }
    }

    // remove a class from an element
    function removeClass(element, className) {
        if (element.classList) {
            element.classList.remove(className);
        } else {
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    // listen to multiple events, optional useCapture
    function addEventListeners(element, events, functions, capture) {
        var eventsArr = events.split(' '),
            i;

        if (capture === undefined) {
            capture = false;
        }

        for (i = 0; i < eventsArr.length; i += 1) {
            element.addEventListener(eventsArr[i], functions, capture);
        }
    }

    // *********************************************************************************
    // * ZWIPER FUNCTIONALITY
    // *********************************************************************************

    // vars!
    var zwiperDefaults, zwiperObj, zwiperContainer, zwiperContainerHtml, zwiperWrapper, zwiperContainerWidth, zwiperContainerHeight, zwiperSlides, slide, i, clicks, zwiperSettings = {}, objProp, transformWithPref, transitionDurationWithPref, transitionTimingFunctionWithPref, prefixProp = {}, transitionend, prefixEvent = {}, zwiperEaseInOut, zwiperEaseOut, zwiperEaseIn, JSLintShutUp;

    // Default zwiper settings. Can be overwritten
    zwiperDefaults = {
        container: 'zwiper-container',
        slide: 'zwiper-slide',
        height: undefined,
        width: undefined,
        transitionDuration: undefined,
        transitionTiming: 'zwiper-ease-in-out',
        createNav: true,
        bulletNav: false,
        navContainer: 'zwiper-nav-container',
        prevNextBtns: true
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
    // log prefix properties as an object
    console.dir(prefixProp);

    // ****
    // Add events that require a prefix to the prefixEvent object
    // ****
    prefixEvent.transitionend = 'transitionend webkitTransitionEnd oTransitionEnd msTransitionEnd';
    // log prefix events to the log
    console.dir(prefixEvent);

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
    zwiperContainer.style.position = 'relative';

    // get width and store in zwiperContainerWidth var
    if (zwiperSettings.width === undefined) {
        zwiperContainerWidth = parseInt(zwiperContainer.offsetWidth, 10);
        zwiperContainer.style.width = zwiperContainerWidth + 'px';
    } else if (zwiperSettings.width.indexOf('px') !== -1) {
        zwiperContainerWidth = parseInt(zwiperSettings.width.replace('px', ''), 10);
        zwiperContainer.style.width = zwiperContainerWidth + 'px';
    } else if (zwiperSettings.width.indexOf('%') !== -1) {
        zwiperContainer.style.width = zwiperSettings.width;
        zwiperContainerWidth = zwiperContainer.offsetWidth;
    } else {
        zwiperContainerWidth = parseInt(zwiperSettings.width, 10);
        zwiperContainer.style.width = zwiperContainerWidth + 'px';
    }

    // get height and store in zwiperContainerHeight var
    if (zwiperSettings.height === undefined) {
        zwiperContainerHeight = parseInt(zwiperContainer.offsetHeight, 10);
        zwiperContainer.style.height = zwiperContainerHeight + 'px';
    } else if (zwiperSettings.height.indexOf('px') !== -1) {
        zwiperContainerHeight = parseInt(zwiperSettings.height.replace('px', ''), 10);
        zwiperContainer.style.height = zwiperContainerHeight + 'px';
    } else if (zwiperSettings.height.indexOf('%') !== -1) {
        zwiperContainer.style.height = zwiperSettings.height;
        zwiperContainerHeight = zwiperContainer.offsetHeight;
    } else {
        zwiperContainerHeight = parseInt(zwiperSettings.height, 10);
        zwiperContainer.style.height = zwiperContainerHeight + 'px';
        console.log(zwiperContainerHeight);
    }

    // retrieve nr of slides store zwiperSlides var
    zwiperSlides = zwiperContainer.querySelectorAll('.' + zwiperSettings.slide);
    console.log('zwiperSlides', zwiperSlides.length);

    // create wrapper that serves as the sliding element
    zwiperWrapper = document.createElement('div');
    addClass(zwiperWrapper, 'zwiper-wrapper');

    for (i = 0; i < zwiperSlides.length; i += 1) {
        zwiperWrapper.appendChild(zwiperSlides[i]);
    }

    zwiperContainer.appendChild(zwiperWrapper);

    // set width for each of the slides
    for (i = 0; i < zwiperSlides.length; i += 1) {
        zwiperSlides[i].setAttribute('style', 'width: ' + zwiperContainerWidth + 'px;');
    }

    // wrapper is container width * nr of slides
    zwiperWrapper.setAttribute('style', 'width: ' + (zwiperContainerWidth * zwiperSlides.length) + 'px;');
    zwiperWrapper.style[prefixProp.transform] = 'translate3D(0,0,0)';

    zwiperEaseInOut = 'cubic-bezier(.7,0,.7,1)';
    zwiperEaseOut = 'cubic-bezier(.5,0,.2,1)';
    zwiperEaseIn = 'cubic-bezier(.8,0,.5,1)';

    // set transition timing
    if (zwiperSettings.transitionDuration === 'zwiper-ease-in-out') {
        zwiperWrapper.style[prefixProp.transitionTimingFunction] = zwiperEaseInOut;
    } else if (zwiperSettings.transitionDuration === 'zwiper-ease-out') {
        zwiperWrapper.style[prefixProp.transitionTimingFunction] = zwiperEaseOut;
    } else if (zwiperSettings.transitionDuration === 'zwiper-ease-in') {
        zwiperWrapper.style[prefixProp.transitionTimingFunction] = zwiperEaseIn;
    } else {
        zwiperWrapper.style[prefixProp.transitionTimingFunction] = zwiperSettings.transitionTiming;
    }

    // set transition duration
    if (zwiperSettings.transitionDuration !== undefined) {
        zwiperWrapper.style[prefixProp.transitionDuration] = zwiperSettings.transitionDuration;
    }

    // ****
    // Append active slide class current slide in view and remove from if applied to other slide
    // ****
    function setActiveSlide() {
        var distanceLeft, activeSlideNr;
        distanceLeft = translate3DToObject(zwiperWrapper.style[prefixProp.transform]).x * -1;
        activeSlideNr = distanceLeft / zwiperContainerWidth;

        // set active slide class
        for (i = 0; i < zwiperSlides.length; i += 1) {
            if (i === activeSlideNr) {
                addClass(zwiperSlides[i], 'active-slide');
            } else {
                removeClass(zwiperSlides[i], 'active-slide');
            }
        }
        // shout out to the log
        console.log('active slide', activeSlideNr);
    }

    // initiate the set active slide function on transition end with a helper function to listen to multiple events
    addEventListeners(zwiperWrapper, prefixEvent.transitionend, setActiveSlide);

    // ****
    // Next/Previous slide functions
    // ****
    // next slide
    function toNextSlide() {
        var distanceLeft, activeSlideNr, activeSlide, newDistance, i;
        distanceLeft = translate3DToObject(zwiperWrapper.style[prefixProp.transform]).x * -1;
        // calculate the new transition value
        if (distanceLeft === parseInt(window.getComputedStyle(zwiperWrapper, null).getPropertyValue('width'), 10) - zwiperContainerWidth) {
            newDistance = 0;
        } else {
            newDistance = distanceLeft + zwiperContainerWidth;
        }
        // set position
        zwiperWrapper.style[prefixProp.transform] = 'translate3D(' + newDistance * -1 + 'px, 0, 0)';
        // shout out to the log
        console.log('old position', distanceLeft, 'new position', newDistance);
    }
    // previous slide
    function toPrevSlide() {
        var distanceLeft, activeSlideNr, activeSlide, newDistance;
        distanceLeft = translate3DToObject(zwiperWrapper.style[prefixProp.transform]).x * -1;
        // calculate the new transition value
        if (distanceLeft === 0) {
            newDistance = zwiperContainerWidth * (zwiperSlides.length - 1);
        } else {
            newDistance = distanceLeft - zwiperContainerWidth;
        }
        // set position
        zwiperWrapper.style[prefixProp.transform] = 'translate3D(' + newDistance * -1 + 'px, 0, 0)';
        // shout out to the log
        console.log('old position', distanceLeft, 'new position', newDistance);
    }

    // ****
    // Create navigation
    // ****
    function createNav() {
        var navContainer, prevBtn, nextBtn;
        navContainer = document.createElement('div');
        addClass(navContainer, zwiperSettings.navContainer);

        if (zwiperSettings.prevNextBtns === true) {
            prevBtn = document.createElement('a');
            nextBtn = document.createElement('a');
            addClass(prevBtn, 'zwiper-prev-slide');
            addClass(nextBtn, 'zwiper-next-slide');
            prevBtn.textContent = 'Previous slide';
            nextBtn.textContent = 'Next slide';

            navContainer.appendChild(prevBtn);
            navContainer.appendChild(nextBtn);

            // add next and prev slide methods to buttons
            nextBtn.addEventListener('click', function (e) {
                e.preventDefault();
                toNextSlide();
            }, false);
            prevBtn.addEventListener('click', function (e) {
                // TODO: Create a function and place it here and in the prevSlide()-hook
                e.preventDefault();
                toPrevSlide();
            }, false);
        }

        zwiperContainer.appendChild(navContainer);
    }

    if (zwiperSettings.createNav === true) {
        createNav();
    }



    // *********************************************************************************
    // * METHODS (hooks)
    // *********************************************************************************

    // ****
    // Add method nextSlide() to transition to next slide
    // ****
    this.nextSlide = function () {
        toNextSlide();
    };

    // ****
    // Add method prevSlide() to transition to previous slide
    // ****
    this.prevSlide = function () {
        toPrevSlide();
    };
}; // end zwiper