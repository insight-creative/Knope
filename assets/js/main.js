import barba from '@barba/core';
// import barbaPrefetch from '@barba/prefetch';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pageTransitionOut, pageTransitionIn, updateMenu } from './partials';

// barba.use(barbaPrefetch);
gsap.registerPlugin(ScrollTrigger);

const menu = document.querySelector(".mobile-nav .nav-list");
const hamburger = document.querySelector(".hamburger");
const navClasses = document.querySelector('.site-header');
let scrollState = 0;

var scrollTop = function() {
  return window.scrollY;
};

var scrollDetect = function(collapse, expand) {
  var currentScroll = scrollTop();
  if (currentScroll > scrollState) {
    collapse();
  } else {
    expand();
  }
  scrollState = scrollTop();
};

function collapseNav() {
  navClasses.classList.remove('expand');
  navClasses.classList.add('collapse');
}

function expandNav() {
  navClasses.classList.remove('collapse');
  navClasses.classList.add('expand');
}

window.addEventListener("scroll", function() {
  scrollDetect(collapseNav, expandNav);
});

hamburger.addEventListener("click", toggleMobileMenu);

function toggleMobileMenu() {
    if(menu.classList.contains("nav-open")) {
        this.setAttribute("aria-expanded", "false");
        this.setAttribute("aria-label", "open mobile menu");
        menu.classList.remove("nav-open");
        hamburger.classList.remove("is-active");
    } else {
        menu.classList.add("nav-open");
        hamburger.classList.add("is-active");
        this.setAttribute("aria-expanded","true");
        this.setAttribute("aria-label","close mobile menu");
    }
}

function updateAria() {
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "open mobile menu");
}

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
                start: "top bottom-=50",
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

function homepageAnimations() {
    fadeInContent();
}

function initPageTransitions() {
    // do something before the transition starts
    barba.hooks.before(() => {
        updateMenu();
    });

    // do something after the transition finishes
    barba.hooks.after(() => {
        homepageAnimations();
        updateAria();
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