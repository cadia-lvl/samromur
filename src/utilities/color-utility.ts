import { WheelColor } from '../types/contribute';

export const getRGBWheelColor = (color: WheelColor): number[] => {
    switch (color) {
        case WheelColor.BLUE:
            return [133, 206, 255];
        case WheelColor.RED:
            return [255, 79, 94];
        case WheelColor.GREEN:
            return [96, 193, 151];
        case WheelColor.GRAY:
            return [163, 163, 163];
        default:
            // Default blue!
            return [133, 206, 255];
    }
}

export const getWheelColorString = (color: WheelColor): string => color.toString().toLowerCase();

export const getWheelColorHEXShades = (color: WheelColor): string => {
    switch (color) {
        case WheelColor.BLUE:
            return '#88d1f1, #b1b5e5';
        case WheelColor.RED:
            return '#FF99A1, #FF4F5E';
        case WheelColor.GREEN:
            return '#60C197, #A7DDC5';
        case WheelColor.GRAY:
            return '#424242, #999999';
        default:
            // Default blue!
            return '#88d1f1, #b1b5e5';
    }
}