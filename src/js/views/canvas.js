import { elements } from './base';

const canvas = elements.canvas;
const ctx = elements.ctx;

export const canvasDraw = (width = 1000, height = 600) => {
    
    canvas.width = width;

    canvas.height = height;

};

export const canvasLetter = (px = 70) => {
    ctx.font = `${px}px Roboto Condensed`;
}

export class letterBlock {
    constructor(x, y, w, h, lw, lh, rectColor, letterColor, text, id) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.lw = lw;
        this.lh = lh;
        this.rectColor = rectColor;
        this.letterColor = letterColor;
        this.text = text;
        this.id = id;
        this.drag = false;
    }

    rectDraw() {
        ctx.fillStyle = this.rectColor;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    letterDraw() {
        ctx.fillStyle = this.letterColor;
        ctx.fillText(this.text, this.lw, this.lh);
    }

    fontSize() {
        this.px = this.h * .95;
        canvasLetter(this.px);
    }

    calcCorners() {
        this.x2 = this.x + this.w;
        this.y2 = this.y + this.h;
    }

    withinCanvas(canvasWidth, canvasHeight) {
        
        if (this.x < 0) {
            //console.log(`${this.text} no good 1`);
            this.inCanvas = false;
        } else if (this.x2 > canvasWidth) {
            //console.log(`${this.text} no good 2`);
            this.inCanvas = false;
        } else if (this.y < 0) {
            //console.log(`${this.text} no good 3`);
            this.inCanvas = false;
        } else if (this.y2 > canvasHeight) {
            //console.log(`${this.text} no good 4`);
            this.inCanvas = false;
        } else {
            //console.log(`${this.text} is good`);
            this.inCanvas = true;
        }
    }

    isDrag(e) {
        if (e.offsetX > this.x && e.offsetX < this.x2 && e.offsetY > this.y && e.offsetY < this.y2) {
            this.drag = true;
            console.log(`${this.text} is ready to drag!`)
        } else {
            this.drag = false;
        };
    }

    dragging(e) {
        if (this.drag) {
            
            elements.ctx.clearRect(this.x, this.y, this.w, this.h);
            
            this.x = e.offsetX - (this.w / 2);
            this.x2 = e.offsetX + (this.w / 2);
            this.y = e.offsetY - (this.h / 2);
            this.y2 = e.offsetY + (this.h / 2);

            this.rectColor = '#229552';
            
            this.lw = this.x + (this.w * .33);
            this.lh = this.y + (this.h * .75);
        }
    }

    draggingPulse() {
        
        if (this.drag) {
            let originalW, originalH, original, perChange;
            
            originalW = this.w;
            originalH = this.h;
            original = 10
            perChange = original / 100;

            this.dragPulseFn = setInterval(() => {
                //increase size of block if w and h are less than 110% of original w and h
                
                if (this.drag) {
                    if (this.w < originalW * 1.5 && this.h < originalH * 1.5) {
                        //incrementally increase size of w and h
                        //elements.ctx.clearRect(this.x, this.y, this.w, this.h);
                        
                        this.w = originalW * (perChange + 1);
                        this.h = originalH * (perChange + 1);
    
                        original++;
                        
                        //else, decrease size of block until w and h are original size
                    } else {
                        //elements.ctx.clearRect(this.x, this.y, this.w, this.h);
                        
                        this.w = originalW;
                        this.h = originalH;
    
                    }
                } else {
                        this.w = originalW;
                        this.h = originalH;
                    
                    clearInterval(this.dragPulseFn);
                }
                
            }, 50);
        };
        
    }
    
    isCollide(otherBlocks) {
        
        if (!this.drag) {
            
            let oLeft, oRight, oTop, oBottom;

            this.left = this.x;
            this.right = this.x + this.w;
            this.top = this.y;
            this.bottom = this.y + this.h;

            //console.log(`${this.text}: ${this.left}, ${this.right}, ${this.top}, ${this.bottom}`);

            otherBlocks.forEach(el => {
                
                if(this.id != el.id) {
                    
                    oLeft = el.x;
                    oRight = el.x + el.w;
                    oTop = el.y;
                    oBottom = el.y + el.h;

                    //console.log(`${el.text}: ${oLeft}, ${oRight}, ${oTop}, ${oBottom}`);

                    let collisionStates = {
                        1: 'right',
                        2: 'left',
                        3: 'top',
                        4: 'bottom'
                    };
                    
                    if ((oBottom > this.top && oBottom < this.bottom) || (oTop < this.bottom && oBottom > this.bottom)) {
                        
                        //check left and right
                        if (oLeft < this.right && oLeft > this.left) {
                            this.collide = collisionStates[1];
                            this.collidingBlockEdge = oLeft;
                            console.log(`${this.text} is colliding with ${el.text} from ${this.collide}.`);
                        } else if (oRight > this.left && oRight < this.right) {
                            this.collide = collisionStates[2];
                            this.collidingBlockEdge = oRight;
                            console.log(`${this.text} is colliding with ${el.text} from ${this.collide}.`);
                        }
                        
                    } else if ((oRight > this.left && oRight < this.right) || (oLeft < this.right && oLeft > this.left)) {
                        
                        //check top and bottom
                        if (oBottom > this.top && oBottom < this.bottom) {
                            this.collide = collisionStates[3];
                            this.collidingBlockEdge = oBottom;
                            console.log(`${this.text} is colliding with ${el.text} from ${this.collide}.`);
                        } else if (oTop > this.bottom && oTop < this.top) {
                            this.collide = collisionStates[4];
                            this.collidingBlockEdge = oTop;
                            console.log(`${this.text} is colliding with ${el.text} from ${this.collide}.`);
                        }
                    
                    } else {
                        //console.log(`${this.text} is not colliding`);
                        this.collide = false;
                    };

                };

                
            });
        };
            
    }
    
    colliding() {
        
        if (this.collide) {
            
            elements.ctx.clearRect(this.x, this.y, this.w, this.h);
            
            if (this.collide === 'right') {
                
                this.x = this.collidingBlockEdge - this.w;
            
            } else if (this.collide === 'left') {
                
                this.x = this.collidingBlockEdge;

            } else if (this.collide === 'top') {
                
                this.y = this.collidingBlockEdge;
            
            } else {
                
                this.y = this.collidingBlockEdge - this.h;
    
            }
    
            this.lw = this.x + (this.w *  .33);
            this.lh = this.y + (this.h * .75);
    
            this.rectDraw();
            this.letterDraw();
        };
        
    }

    push(canvasWidth, canvasHeight) {
        if (!this.inCanvas) {

            elements.ctx.clearRect(this.x, this.y, this.w, this.h);

            if (this.collide === 'right') {
           
                this.x = this.x + 2;
            
            } else if (this.collide === 'left') {
                
                this.x = this.x - 2;
            
            } else if (this.collide === 'top') {
                
                this.y = this.y - 2;
            
            } else if (this.collide === 'bottom') {
                
                this.y = this.y + 2;
    
            } else {
                //reset for when you have multiple collisions in a stack at side of canvas
                this.x = ((canvasWidth / 2) - (this.w / 2));
                this.y = ((canvasHeight / 2) - (this.h / 2));

            }
    
            this.lw = this.x + (this.w *  .33);
            this.lh = this.y + (this.h * .75);
    

        };
    }

    resize (numOfBlocks, canvasWidth, canvasHeight, perChangeWidth, perChangeHeight) {
        this.w = canvasWidth / numOfBlocks + 2;
        this.h = canvasHeight / numOfBlocks;

        this.x = this.x * perChangeWidth;
        this.y = this. y * perChangeHeight;

        this.lw = this.x + (this.w *  .33);
        this.lh = this.y + (this.h * .75);

        this.rectDraw();
        this.letterDraw();
    }

    endCollide() {
        this.collide = false;
    }

    endDrag() {

        this.drag = false;
        this.rectColor = '#2ecc71';

        this.rectDraw();
        this.letterDraw();
    }

    endDraggingPulse() {
        if (this.drag === false) clearInterval(this.dragPulseFn);
    }

};

//if ((oBottom > this.top && (oRight > this.left || oLeft === this.left || oLeft < this.right)) || (oTop > this.bottom && (oLeft > this.right || oRight === this.right || oRight < this.left)) || (oLeft < this.right && (oBottom > this.top || oBottom === this.bottom || oTop < this.bottom)) || (oRight < this.left && (oTop > this.bottom || oTop === this.top || oBottom < this.top))) {
