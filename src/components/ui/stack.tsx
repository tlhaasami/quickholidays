import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function CardRotate({
  children,
  onSendToBack,
  sensitivity,
  disableDrag
}: {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  disableDrag: boolean;
}) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleDragEnd = (_: any, info: any) => {
    const isPastThreshold = Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity;
    if (isPastThreshold) {
      onSendToBack();
    }
    setX(0);
    setY(0);
  };

  return (
    <motion.div
      style={{
        x,
        y,
        position: 'absolute',
        width: '100%',
        height: '100%',
        cursor: disableDrag ? 'default' : 'grab'
      }}
      animate={{ x, y }}
      drag={!disableDrag}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: disableDrag ? 'default' : 'grabbing' }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  sendToBackOnClick?: boolean;
  cards?: React.ReactNode[];
  animationConfig?: { stiffness: number; damping: number };
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  mobileClickOnly?: boolean;
  mobileBreakpoint?: number;
  onCardClick?: () => void;
}

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cards = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  mobileClickOnly = false,
  mobileBreakpoint = 768,
  onCardClick
}: StackProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);

  const shouldDisableDrag = mobileClickOnly && isMobile;
  const shouldEnableClick = sendToBackOnClick || shouldDisableDrag;

  const [stack, setStack] = useState<{ id: number; content: React.ReactNode }[]>(() => {
    if (cards.length) {
      return cards.map((content, index) => ({ id: index + 1, content })).reverse();
    }
    return [];
  });

  useEffect(() => {
    if (cards.length && stack.length !== cards.length) {
      setStack(cards.map((content, index) => ({ id: index + 1, content })).reverse());
    }
  }, [cards.length]);

  const sendToBack = (id: number) => {
    setStack(prev => {
      const newStack = [...prev];
      const index = newStack.findIndex(card => card.id === id);
      if (index === -1) return prev;
      const [card] = newStack.splice(index, 1);
      newStack.unshift(card);
      return newStack;
    });
  };

  useEffect(() => {
    if (autoplay && stack.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        const topCardId = stack[stack.length - 1].id;
        sendToBack(topCardId);
      }, autoplayDelay);

      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayDelay, stack, isPaused]);

  if (!mounted) return null;

  return (
    <div
      className="relative w-full h-full"
      style={{
        perspective: 600
      }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {(() => {
        const visibleStack = stack.slice(-7);
        return visibleStack.map((card, index) => {
          return (
            <CardRotate
              key={card.id}
              onSendToBack={() => sendToBack(card.id)}
              sensitivity={sensitivity}
              disableDrag={shouldDisableDrag}
            >
              <motion.div
                className="rounded-2xl overflow-hidden w-full h-full"
                onClick={() => {
                  if (onCardClick) {
                    onCardClick();
                  } else if (shouldEnableClick) {
                    sendToBack(card.id);
                  }
                }}
                animate={{
                  rotateZ: (visibleStack.length - index - 1) * 2.5 + (randomRotation ? Math.random() * 4 - 2 : 0),
                  scale: 1 + index * 0.02 - visibleStack.length * 0.02,
                  y: (visibleStack.length - index - 1) * -4,
                  transformOrigin: '80% 90%'
                }}
                initial={false}
                transition={{
                  type: 'spring',
                  stiffness: animationConfig.stiffness,
                  damping: animationConfig.damping
                }}
              >
                {card.content}
              </motion.div>
            </CardRotate>
          );
        });
      })()}
    </div>
  );
}
