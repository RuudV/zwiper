zwiper
======

## Goals
### 1.0 Release
Default enabled:
* Next slide & previous slide buttons
* Mobile swiping, desktop dragging

Optional:
* Ajax loaded slides
* Slide navigational bullets
* Responsive
* Animation duration settings
* Arrow keys navigation

### Future Features
* Carousel (endless sliding)
* Slide direction (horizontal or vertical)
* Automatic sliding (triggered by waiting duration)
* Pause button when automatic sliding is enabled (key binded to spacebar)

## Usage
###HTML
```html
<section class="zwiper-container">
  <div class="zwiper-slide"> <!-- First Slide -->
  </div>
  <div class="zwiper-slide"> <!-- Second Slide -->
  </div>
</section>
```

### Javascript
```javascript
var slider = new zwiper();
```

```javascript
var slider = new zwiper('zwiper-container');
```
