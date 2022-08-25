import { css, InterpolationFunction } from 'styled-components';

export interface InteractionProps {
    /**
     * Увеличение по ховеру нажатию / уменьшение по нажатию.
     * Задает одновременно `scaleOnHover` и `scaleOnPress`
     */
    scaleOnInteraction?: boolean;
    /**
     * Увеличение по ховеру нажатию
     */
    scaleOnHover?: boolean;
    /**
     * Уменьшение по нажатию
     */
    scaleOnPress?: boolean;
}

export const applyInteraction: InterpolationFunction<InteractionProps> = ({
    scaleOnInteraction,
    scaleOnHover,
    scaleOnPress,
}) => css`
    transition: transform 0.1s ease-in;

    ${(scaleOnHover || scaleOnInteraction) &&
    css`
        // Сработает только для устройств, у которых есть мышь или другой манипулятор
        @media (hover: hover) {
            &:hover {
                transform: scale(1.04);
            }
        }
    `}

    ${(scaleOnPress || scaleOnInteraction) &&
    css`
        &:active {
            transform: scale(0.96);
        }
    `}
`;
