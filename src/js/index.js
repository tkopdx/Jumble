import * as canvasView from './views/canvas';
import { elements, shuffle, answerCheck, arrVerify } from './views/base';
import { winUI } from './views/feedback';
import { Stopwatch } from './models/stopwatch';
import Hammer from 'hammerjs';


/*
GLOBAL STATE
*/
let state = {};

/*
*
* START GAME
*/

const newBlock = () => {
    let word, characters, randCharacters;
    word = elements.textIn.value
    elements.textIn.value = '';
    
    if (state.stopwatch) {
        state.stopwatch.stop();
        state.stopwatch = null;
    };

    if (state.globalID) {
        cancelAnimationFrame(state.globalID);
        state.globalID = null;
    };
    
    state = {  
        blocks: [],
        playing: false,
        answer: '',
        inCanvasChecks: []
    };

    elements.feedback.textContent = '';
    elements.timer.textContent = '';

    elements.ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
    state.answer = word;
    state.playing = true;
    state.awaitingFirstDrag = true;
    characters = [...word];
    do {
        randCharacters = shuffle(characters);
    }
    while (randCharacters.join('') === state.answer);

    let i = 1;
    
    randCharacters.forEach(letter => {
        let blockx, blocky;

        blockx = (elements.canvas.width / (randCharacters.length+3));
        blocky = (elements.canvas.width / (randCharacters.length+3));

        state.blocks.push(new canvasView.letterBlock(i, i, blockx, blocky, (blockx * 1.2) + (i*blockx), (blocky * 1.6), '#2ecc71', 'black', letter, i));

        i++;
    })

    //start gameloop
    gameLoop();

};

/*
*
* GAME LOOP
*/
const gameLoop = () => {
    
    state.globalID = window.requestAnimationFrame(gameLoop);

    elements.ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);

    if (state.awaitingFirstDrag) {
        canvasView.startMessage(elements.canvas.width / 10, elements.canvas.height / 2);
    };
    
    state.blocks.forEach(el => el.calcCorners());
    state.blocks.forEach(el => el.fontSize());
    state.blocks.forEach(el => el.withinCanvas(elements.canvas.width, elements.canvas.height));
        
    //push all inCanvas checks to one array in state
    state.blocks.forEach(el => state.inCanvasChecks.push(el.inCanvas));
    
    if (state.dragging && arrVerify(state.inCanvasChecks) && state.touchX > state.blocks[0].w / 2  && state.touchX < (elements.canvas.width - (state.blocks[0].w / 2)) && state.touchY > state.blocks[0].h / 2 && state.touchY < (elements.canvas.height - (state.blocks[0].h / 2))) {
            //check if being dragged
            state.blocks.forEach(el => el.isDrag(state.touchX, state.touchY));
            //render dragging
            state.blocks.forEach(el => el.dragging(state.touchX, state.touchY));
            //check for collision
            state.blocks.forEach(el => el.isCollide(state.blocks));
            //render collision
            state.blocks.forEach(el => el.colliding());

            //state.blocks.forEach(el => console.log(`${el.text}: `, el));
    }

    //clear inCanvas array for next collision test
    state.inCanvasChecks = [];
    
    //draw all of the blocks
    state.blocks.forEach(el => el.rectDraw());
    state.blocks.forEach(el => el.letterDraw());

    //set drag and collide to false in all blocks and push blocks that are out of canvas or reset them
    state.blocks.forEach(el => el.endDrag());
    state.blocks.forEach(el => el.push(elements.canvas.width, elements.canvas.height));
    state.blocks.forEach(el => el.endCollide());

    //check if the spelling is correct
    if (answerCheck(state.blocks, state.answer) && !state.dragging) {
        state.playing = false;
        
        //display UI message
        winUI(state.playing);
            
        //stop timer
        state.stopwatch.stop();

        //end AnimationFrame
        cancelAnimationFrame(state.globalID);
        
    };

};

/*
*
* RESIZE CONTROLLER
*/

const resize = () => {
    
    let originalWidth, originalHeight, percChangeWidth, perChangeHeight;

    originalWidth = elements.canvas.width;

    originalHeight = elements.canvas.height;
    //redraw canvas based on window resize
    elements.canvas.width = document.documentElement.clientWidth * .9;

    elements.canvas.height = document.documentElement.clientHeight * .7;

    percChangeWidth = elements.canvas.width / originalWidth;

    perChangeHeight = elements.canvas.height / originalHeight;
    
    canvasView.canvasDraw(elements.canvas.width, elements.canvas.height);
    //redraw blocks based on new canvas size
    state.blocks.forEach(el => {
        el.resize(state.blocks.length, (elements.canvas.width * .7), (elements.canvas.width * .7), percChangeWidth, perChangeHeight);
    });
};

/*
*
* UI CONTROLLER
*/
const displayUI = () => {
    //set UI, timer, and dragging to play settings
    winUI(state.playing);
    
    //start timer
    if (!state.stopwatch) {
        
        state.stopwatch = new Stopwatch;
    
        state.stopwatch.start();
    }

};


/*
*
* LOAD CONTROLLER
*/
const init = () => {
    
    state.playing = false;
    
    //draw the canvas based on window size
    elements.canvas.width = document.documentElement.clientWidth * .9;

    elements.canvas.height = document.documentElement.clientHeight * .7;
    
    canvasView.canvasDraw(elements.canvas.width, elements.canvas.height);
};

/*
*
* EVENT LISTENERS
*/

const buildBtn = new Hammer(document.querySelector('.build'));

const mc = new Hammer(elements.canvas);

mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

buildBtn.on('tap', newBlock);

mc.on('pan', (e) => {

    if (state.awaitingFirstDrag) {
        state.awaitingFirstDrag = false;
    };

    if (state.playing) {
        displayUI();
    };

    if (state.playing) {
        state.dragging = true;
        state.e = e;
        state.touchX = e.center.x - e.target.offsetLeft;
        state.touchY = e.center.y - e.target.offsetTop;

        console.log(state.touchX, state.touchY);
    };
});

mc.on('panend', () => {

    state.dragging = false;

});

window.addEventListener('load', init);

window.addEventListener('resize', resize);