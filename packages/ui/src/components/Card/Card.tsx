import React from 'react';
import styled, { css } from 'styled-components';
import { surfaceLiquid01 } from '@salutejs/plasma-tokens';

import { addFocus, FocusProps, applyMotion, MotionProps, applyRoundness, RoundnessProps, radiuses } from '../../mixins';
import { Body1 } from '../Typography';

// В этих константах задаем размеры в em, чтобы не зависеть напрямую от пикселей
// В то же время в числителях - значения в пикселях, взятые из макета
const fontSize = 16;
const shadowOffset = 8 / fontSize;
const shadowSize = 24 / fontSize;
const outlineSize = 2 / fontSize;
const DEFAULT_ROUNDNESS = 20;

interface StyledRootProps extends FocusProps, MotionProps, RoundnessProps {}

export const StyledCard = styled(Body1)<StyledRootProps>`
    ${applyMotion};
    ${applyRoundness};

    position: relative;

    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    flex-shrink: 0;

    background: ${surfaceLiquid01};
    box-shadow: 0 ${shadowOffset}em ${shadowSize}em rgba(0, 0, 0, 0.1);

    transition: transform 0.4s ease-in-out;

    ${({ focused, outlined, roundness }) => css`
        ${addFocus({
            focused,
            outlined,
            outlineSize: `${outlineSize}rem`,
            outlineRadius: `${radiuses[roundness] + outlineSize}rem`,
        })}

        &:focus {
            outline: none;
        }
    `}
`;

export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
        MotionProps,
        FocusProps,
        Partial<RoundnessProps> {}

// eslint-disable-next-line prefer-arrow-callback
export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
    { roundness = DEFAULT_ROUNDNESS, children, ...rest },
    ref,
) {
    return (
        <StyledCard ref={ref} roundness={roundness} {...rest}>
            {children}
        </StyledCard>
    );
});
