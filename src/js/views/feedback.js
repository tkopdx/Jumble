import { elements } from './base';

export const winUI = (playing) => {
    if (playing) {
        elements.feedback.textContent = "Spell!";
    } else {
        elements.feedback.textContent = "You win!";
    };
};