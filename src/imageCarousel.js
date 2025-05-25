import emptyNavDot from "./empty-dot.svg";
import filledNavDot from "./filled-dot.svg";

const carousel = (function () {
    let queuedSlide;
    let currentSlideIndex = 0;

    const next = function (slidesContainer, navDotContainer) {
        const slides = slidesContainer.querySelectorAll(".day-slide");
        const currentSlide = slides[currentSlideIndex];

        // get index of next slide, wraps back to front if current is the last slide
        const nextSlideIndex = (currentSlideIndex + 1) % slides.length;
        const nextSlide = slides[nextSlideIndex];

        // change slides
        currentSlide.style.opacity = "0";
        // give prev slide time to fade out before 'hidden'
        setTimeout(() => {
            currentSlide.style.visibility = "hidden";
            nextSlide.style.visibility = "visible";
            nextSlide.style.opacity = "1";
        }, 500);

        updateNavDot(navDotContainer, currentSlideIndex, nextSlideIndex);

        currentSlideIndex = ++currentSlideIndex % slides.length;
    };

    const previous = function (slidesContainer, navDotContainer) {
        const slides = slidesContainer.querySelectorAll(".day-slide");
        const currentSlide = slides[currentSlideIndex];

        // get index of prev slide, wraps back to end if current is the first slide
        let prevSlideIndex = currentSlideIndex - 1;
        if (prevSlideIndex == -1) {prevSlideIndex = slides.length - 1}
        const prevSlide = slides[prevSlideIndex];

        // change slides
        currentSlide.style.opacity = "0";
        // give prev slide time to fade out before 'hidden'
        setTimeout(() => {
            currentSlide.style.visibility = "hidden";
            prevSlide.style.visibility = "visible";
            prevSlide.style.opacity = "1";
        }, 500);

        updateNavDot(navDotContainer, currentSlideIndex, prevSlideIndex);

        currentSlideIndex--;
        if (currentSlideIndex == -1) {currentSlideIndex = slides.length - 1};
    };

    const jumpToSlide = function(slidesContainer, navDotContainer, selectedSlideIndex) {
        const slides = slidesContainer.querySelectorAll(".day-slide");
        const currentSlide = slides[currentSlideIndex];

        const selectedSlide = slides[selectedSlideIndex];

        // change slides
        currentSlide.style.opacity = "0";
        // give prev slide time to fade out before 'hidden'
        setTimeout(() => {
            currentSlide.style.visibility = "hidden";
            selectedSlide.style.visibility = "visible";
            selectedSlide.style.opacity = "1";
        }, 500);

        updateNavDot(navDotContainer, currentSlideIndex, selectedSlideIndex);

        currentSlideIndex = selectedSlideIndex;
    }

    const updateNavDot = function(navDotContainer, prevDotIndex, newDotIndex) {
        const dots = navDotContainer.querySelectorAll('img');
        dots[prevDotIndex].src = emptyNavDot;
        dots[newDotIndex].src = filledNavDot;
    }

    // source takes:
    //  1. 'next'
    //  2. 'prev'
    //  3. 'initialization' (skips the first two if's and only sets the the timeout at the end)
    //  4.  an int representing the index of the slide to jump to
    const slideShow = function(slidesContainer, navDotContainer, source) {
        if (source == 'next') {
            next(slidesContainer, navDotContainer);
        }
        else if (source == 'prev') {
            previous(slidesContainer, navDotContainer);
        }
        else if (source == 'initialization') {
            // continue    
        }
        else {
            jumpToSlide(slidesContainer, navDotContainer, source);
        }

        clearTimeout(queuedSlide);

        // set timeout for upcoming slide
        queuedSlide = setTimeout(() => {
            slideShow(slidesContainer, navDotContainer, 'next');
        }, 10000);
    }

    return { slideShow };
})();

export default carousel;
