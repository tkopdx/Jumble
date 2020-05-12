import * as canvasView from './views/canvas';
import { elements, shuffle, answerCheck, arrVerify } from './views/base';
import { winUI } from './views/feedback';
import { Stopwatch } from './models/stopwatch';


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
    
    state = {  
        blocks: [],
        playing: false,
        answer: '',
        inCanvasChecks: []
    };

    elements.ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
    state.answer = word;
    state.playing = true;
    characters = [...word];
    randCharacters = shuffle(characters);

    let i = 0;
    
    randCharacters.forEach(letter => {
        let blockx, blocky;

        blockx = (elements.canvas.width / (randCharacters.length+2));
        blocky = (elements.canvas.width / (randCharacters.length+2));

        state.blocks.push(new canvasView.letterBlock(blockx + (i*blockx), blocky, blockx, blocky, (blockx * 1.3) + (i*blockx), (blocky * 1.75), '#2ecc71', 'black', letter, i));

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
    
    window.requestAnimationFrame(gameLoop);

    elements.ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
    
    state.blocks.forEach(el => el.calcCorners());
    state.blocks.forEach(el => el.fontSize());
    state.blocks.forEach(el => el.withinCanvas(elements.canvas.width, elements.canvas.height));
        
    //push all inCanvas checks to one array in state
    state.blocks.forEach(el => state.inCanvasChecks.push(el.inCanvas));
    
    if (state.dragging && arrVerify(state.inCanvasChecks) && state.e.offsetX > state.blocks[0].w / 2  && state.e.offsetX < (elements.canvas.width - (state.blocks[0].w / 2)) && state.e.offsetY > state.blocks[0].h / 2 && state.e.offsetY < (elements.canvas.height - (state.blocks[0].h / 2))) {
            //check if being dragged
            state.blocks.forEach(el => el.isDrag(state.e));
            //render dragging
            state.blocks.forEach(el => el.dragging(state.e));
            //check for collision
            state.blocks.forEach(el => el.isCollide(state.blocks));
            //render collision
            state.blocks.forEach(el => el.colliding());
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
        winUI(state.playing);
            
        //stop timer
        state.stopwatch.stop();
        
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
    elements.canvas.width = document.documentElement.clientWidth * .6;

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
    elements.canvas.width = document.documentElement.clientWidth * .6;

    elements.canvas.height = document.documentElement.clientHeight * .7;
    
    canvasView.canvasDraw(elements.canvas.width, elements.canvas.height);
};

/*
*
* EVENT LISTENERS
*/

document.querySelector('.build').addEventListener('click', newBlock);

elements.canvas.addEventListener('mousedown', () => {
    
    state.clickingCanvas = true;

    if (state.playing) {
        displayUI();
    }

});

elements.canvas.addEventListener('mousemove', (e) => {

    if (state.playing && state.clickingCanvas) {
        state.dragging = true;
        state.e = e;
    };
});

elements.canvas.addEventListener('mouseup', () => {

    state.clickingCanvas = false;
    state.dragging = false;

});

window.addEventListener('load', init);

window.addEventListener('resize', resize);