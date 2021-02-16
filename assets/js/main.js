import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pageTransitionOut, pageTransitionIn, updateMenu } from './partials';

barba.use(barbaPrefetch);
gsap.registerPlugin(ScrollTrigger);

const menuButton = document.querySelector(".menu-button-wrap");
const menu = document.querySelector(".mobile-nav .nav-list");
const hamburger = document.querySelector(".hamburger");

menuButton.addEventListener("click", toggleMobileMenu);

function toggleMobileMenu() {
    menu.classList.toggle("nav-open");
    hamburger.classList.toggle("is-active");
}

// mobileNavItem.addEventListener("click", updateAria);

// function toggleMobileMenu() {
//     if(menu.classList.contains("nav-open")) {
//         this.setAttribute("aria-expanded", "false");
//         this.setAttribute("aria-label", "open mobile menu");
//         menu.classList.remove("nav-open");
//         hamburger.classList.remove("is-active");
//         console.log("menu closed");
//     } else {
//         menu.classList.add("nav-open");
//         hamburger.classList.add("is-active");
//         this.setAttribute("aria-expanded","true");
//         this.setAttribute("aria-label","close mobile menu");
//         console.log("menu opened");
//     }
// }

// function updateAria() {
//     menuButton.setAttribute("aria-expanded", "false");
//     menuButton.setAttribute("aria-label", "open mobile menu");
//     console.log("menu item clicked");
// }

function fadeInContent() {
    const fadeWrapper = document.querySelector(".fade-wrapper .container");
    const fadeUp = document.querySelectorAll(".fade-up");

    gsap.utils.toArray(fadeUp).forEach((fade) => {
        gsap.from(fade, {
            opacity: 0,
            y: 20,
            duration: .5,
            ease: 'Power2.in',
            scrollTrigger: {
                trigger: fade,
                start: "top bottom-=100",
                toggleActions: "play none none reverse",
            }
        })
    });
    if (document.body.contains(fadeWrapper)) {
        gsap.from(fadeWrapper, {
            opacity: 0,
            y: 20,
            duration: .5,
            ease: 'Power2.in',
            delay: .5,
            scrollTrigger: {
                trigger: fadeWrapper,
                start: "top bottom-=25",
                toggleActions: "play none none reset",
            }
        });
    }
}

function initZoom() {
    const zoomImages = document.querySelectorAll(".zoom-image");
    gsap.utils.toArray(zoomImages).forEach((section) => {
        const image = section.querySelector('img');
        gsap.to(image, {
            scale: 1.1,
            scrollTrigger: {
                trigger: section,
                scrub: true,
            }
        })
    });
}

function homepageAnimations() {
    fadeInContent();
    initZoom();
}

function initPageTransitions() {
    // do something before the transition starts
    barba.hooks.before(() => {
        updateMenu();
    });

    // do something after the transition finishes
    barba.hooks.after(() => {
        homepageAnimations();
        ga('set', 'page', window.location.pathname);
        ga('send', 'pageview');
    });

    // scroll to the top of the page
    barba.hooks.enter(() => {
        window.scrollTo(0, 0);
    });

    barba.init({
        timeout: 7000,
        transitions: [{
            name: 'fade-transition',
            once(data) {
                // do something once on the initial page load
                homepageAnimations();
            },
            async leave(data) {
                // animate loading screen in
                await pageTransitionOut(data.current);
                data.current.container.remove();
            },
            async enter(data) {
                // animate loading screen away
                pageTransitionIn(data.next);
            },
            async beforeEnter(data) {
                ScrollTrigger.getAll().forEach(t => t.kill());
            }

        }]
    });
}

initPageTransitions();