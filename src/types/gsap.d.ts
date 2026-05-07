declare namespace gsap {
  namespace core {
    class Tween {
      kill(): void
      pause(): this
      resume(): this
      progress(value?: number): this | number
    }
    class Timeline {
      kill(): void
      pause(): this
      resume(): this
    }
  }
}

declare module 'gsap' {
  const gsap: any
  export default gsap
  export { gsap }
  export const TweenMax: any
  export const TweenLite: any
  export const TimelineMax: any
  export const TimelineLite: any
}

declare module 'gsap/Observer' {
  export const Observer: any
}

declare module 'gsap/ScrollTrigger' {
  export const ScrollTrigger: any
}

declare module 'gsap/ScrollSmoother' {
  export const ScrollSmoother: any
}

declare module 'gsap/SplitText' {
  export const SplitText: any
}

declare module 'gsap/Flip' {
  export const Flip: any
}

declare module 'gsap/CustomEase' {
  export const CustomEase: any
}

declare module 'gsap/TextPlugin' {
  export const TextPlugin: any
}

declare module 'gsap/DrawSVGPlugin' {
  export const DrawSVGPlugin: any
}

declare module 'gsap/MorphSVGPlugin' {
  export const MorphSVGPlugin: any
}

declare module 'gsap/MotionPathPlugin' {
  export const MotionPathPlugin: any
}
