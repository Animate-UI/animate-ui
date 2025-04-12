'use client';

import * as React from 'react';
import {
  motion,
  useInView,
  type UseInViewOptions,
  type Transition,
} from 'motion/react';

const ENTRY_ANIMATION = {
  initial: { rotateX: 0 },
  animate: { rotateX: 90 },
};

const EXIT_ANIMATION = {
  initial: { rotateX: 90 },
  animate: { rotateX: 0 },
};

const formatCharacter = (char: string): string => {
  return char === ' ' ? '\u00A0' : char;
};

interface RollingTextProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  transition?: Transition;
  inView?: boolean;
  inViewMargin?: UseInViewOptions['margin'];
  inViewOnce?: boolean;
  text: string;
}

const RollingText = React.forwardRef<HTMLSpanElement, RollingTextProps>(
  (
    {
      transition = { duration: 0.5, delay: 0.1, ease: 'easeOut' },
      inView = false,
      inViewMargin = '0px',
      inViewOnce = true,
      text,
      ...props
    },
    ref,
  ) => {
    const localRef = React.useRef<HTMLSpanElement>(null);
    React.useImperativeHandle(ref, () => localRef.current!);

    const inViewResult = useInView(localRef, {
      once: inViewOnce,
      margin: inViewMargin,
    });
    const isInView = !inView || inViewResult;

    const characters = React.useMemo(() => text.split(''), [text]);

    return (
      <span {...props} ref={ref}>
        {characters.map((char, idx) => (
          <span
            key={idx}
            className="relative inline-block perspective-[9999999px] transform-3d w-auto"
            aria-hidden="true"
          >
            <motion.span
              className="absolute inline-block backface-hidden origin-[50%_25%]"
              initial={ENTRY_ANIMATION.initial}
              animate={isInView ? ENTRY_ANIMATION.animate : undefined}
              transition={{
                ...transition,
                delay: idx * (transition?.delay ?? 0),
              }}
            >
              {formatCharacter(char)}
            </motion.span>
            <motion.span
              className="absolute inline-block backface-hidden origin-[50%_100%]"
              initial={EXIT_ANIMATION.initial}
              animate={isInView ? EXIT_ANIMATION.animate : undefined}
              transition={{
                ...transition,
                delay: idx * (transition?.delay ?? 0) + 0.3,
              }}
            >
              {formatCharacter(char)}
            </motion.span>
            <span className="invisible">{formatCharacter(char)}</span>
          </span>
        ))}

        <span className="sr-only">{text}</span>
      </span>
    );
  },
);
RollingText.displayName = 'RollingText';

export { RollingText, type RollingTextProps };
