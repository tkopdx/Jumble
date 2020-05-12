export const elements = {
    canvas: document.querySelector('.myCanvas'),
    ctx: document.querySelector('.myCanvas').getContext('2d'),
    textIn: document.getElementById('word'),
    feedback:document.querySelector('.gameState'),
    timer: document.querySelector('.timer')
};

export const shuffle = (arr) => {
    let curInd = arr.length, tempVal, randInd;

    while (0 !== curInd) {
        if (0 !== curInd) {
            
            randInd = Math.floor(Math.random() * curInd);
            curInd -= 1;

            tempVal = arr[curInd];
            arr[curInd] = arr[randInd];
            arr[randInd] = tempVal;
        }
    };

    return arr;
};

export const answerCheck = (arr, answer) => {
    let orderedArr, curLetOrder, curWord, won;

    curLetOrder = [];
    
    //turn the blocks x values into a sorted array

    orderedArr = arr.concat().sort((a, b) => {
        if (a.x && b.x) {
           return a.x - b.x;
        }
    });

    // console.log(orderedArr, answer);
    // console.log(inline(orderedArr));


    //based on letters, if blocks are ordered correctly (one width greater on the x axis than the preceding letter)

    orderedArr.forEach(el => {
        curLetOrder.push(el.text);
        curWord = curLetOrder.join('');
    });

    //console.log(curWord === answer);
    //return true if spelling is correct and letters are relatively in line
    won = (curWord, answer, arr) => {
        if (curWord === answer && inline(arr)) {
            //console.log('Word is correct');
            return true;
        } else {
            //console.log('Still spelling');
            return false;
        }
    }

    return won(curWord, answer, orderedArr);
}

const inline = (arr) => {
    let yVals, i, checks;

    i = 1;

    yVals = [];
    checks = [];
    
    arr.forEach(el => yVals.push(el.y));

    //console.log(yVals);

    yVals.forEach(el => {
        let difference;
        
        difference = Math.abs(el - yVals[i]);
        //console.log(difference);
            if (difference > (arr[0].h / 2)) {
                checks.push(false);
            }
            checks.push(true);
            //console.log(checks);
            i++
    });

    return arrVerify(checks);

}

export let arrVerify = (checks) => {
    if (checks.includes(false)) {
        //console.log('still not inline');
        return false;
        
    } 
    //console.log('inline!');
    return true;
 
};

/*
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  */