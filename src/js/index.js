import * as canvasView from './views/canvas';
import { elements, shuffle, answerCheck, final } from './views/base';
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
    
    state = {  
        blocks: [],
        playing: false,
        answer: '',
        inCanvas: []
    };

    elements.ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
    console.log(elements.canvas.width, elements.canvas.height);
    state.answer = word;
    state.playing = true;
    characters = [...word];
    randCharacters = shuffle(characters);
    //console.log(randCharacters);

    let i = 0;
    
    randCharacters.forEach(letter => {
        let blockx, blocky;

        blockx = (elements.canvas.width / (randCharacters.length+2));
        blocky = (elements.canvas.width / (randCharacters.length+2));

        state.blocks.push(new canvasView.letterBlock(blockx + (i*blockx), blocky, blockx, blocky, (blockx * 1.3) + (i*blockx), (blocky * 1.75), '#2ecc71', 'black', letter, i));

        i++;
    })
    
    //Display timer
    //displayTimer(state.playing);


    //start gameloop
    gameLoop();

};

/*
*
* GAME LOOP
*/
const gameLoop = () => {
    
    window.requestAnimationFrame(gameLoop);
    
    state.blocks.forEach(el => {
        el.calcCorners();
        el.fontSize();
        el.withinCanvas(elements.canvas.width, elements.canvas.height);
        el.rectDraw();
        el.letterDraw();
        //el.draggingPulse();
    });

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
* CLICK CONTROLLER
*/
const controller = () => {
    //set UI, timer, and dragging to play settings
    winUI(state.playing);
    
    if (!state.stopwatch) {
        state.stopwatch = new Stopwatch;
    
        state.stopwatch.start();
    };

    //state.displayTimer = state.playing;
    state.dragging = false;

};

/*
*
* DRAG CONTROLLER
*/

const dragController = (e) => {
    
    //check if each block is in the canvas only if objects are being dragged
    state.blocks.forEach(el => state.inCanvas.push(el.inCanvas));
    
    if (final(state.inCanvas)) {

        //check for collision
        let collideEverything = () => {
            state.blocks.forEach(el => {
                el.isCollide(state.blocks);
                el.colliding();
                //console.log('active');
            });
        };

        collideEverything();
        //set dragging to true
        state.dragging = true;
        
        //calculate and render drag
        if (state.click && state.playing && state.dragging && e.offsetX > state.blocks[0].w / 2  && e.offsetX < (elements.canvas.width - (state.blocks[0].w / 2)) && e.offsetY > state.blocks[0].h / 2 && e.offsetY < (elements.canvas.height - (state.blocks[0].h / 2))) {

            state.blocks.forEach(el => {
                el.isDrag(e);
                el.dragging(e);
            });
        };
    };
    
    //clear inCanvas array for next collision test
    state.inCanvas = [];

};

/*
*
* MOUSEUP CONTROLLER
*/

const dragEndController = () => {
    

    state.dragging = false;

    //clearInterval(state.collision);

    //set drag and collide to false in all blocks and push blocks that are out of canvas or reset them
    state.blocks.forEach((el) => {
        el.endDrag();
        el.push(elements.canvas.width, elements.canvas.height);
        el.endCollide();
        //el.endDraggingPulse();
    });
        

    //check if the spelling is correct
    if (answerCheck(state.blocks, state.answer)) {
        state.playing = false;
        winUI(state.playing);
        state.stopwatch.stop();
    
    } else {
        state.playing = true;
        winUI(state.playing);
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

elements.canvas.addEventListener('mousedown', (e) => {
    
    state.click = true;

    if (state.playing) {
        controller(e);
    }

});

elements.canvas.addEventListener('mousemove', (e) => {
    
    if (state.playing && state.click) {
        dragController(e);
    }
});

elements.canvas.addEventListener('mouseup', () => {

    state.click = false;

    if (state.playing) {
        dragEndController();
    }
});

window.addEventListener('load', init);

window.addEventListener('resize', resize);

/*
//Testing
elements.canvas.addEventListener('mousemove', e => {
    let x = e.offsetX;
    let y = e.offsetY;
    //console.log(x, y);
})
*/