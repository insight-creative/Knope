import { gsap } from "gsap";

function contentAnimation() {
    var tl = gsap.timeline();
    tl.from(".hero__inner", {
        opacity: 0,
        duration: 1,
        delay: .5,
    });
}

export default contentAnimation;