/*                                                                                 
                                            8I                                I8   
                                            8I                                I8   
                                            8I   gg                        88888888
                                            8I   ""                           I8   
   ,gggg,gg   ,gggggg,    ,gggg,gg    ,gggg,8I   gg    ,ggg,    ,ggg,,ggg,    I8   
  dP"  "Y8I   dP""""8I   dP"  "Y8I   dP"  "Y8I   88   i8" "8i  ,8" "8P" "8,   I8   
 i8'    ,8I  ,8'    8I  i8'    ,8I  i8'    ,8I   88   I8, ,8I  I8   8I   8I  ,I8,  
,d8,   ,d8I ,dP     Y8,,d8,   ,d8b,,d8,   ,d8b,_,88,_ `YbadP' ,dP   8I   Yb,,d88b, 
P"Y8888P"8888P      `Y8P"Y8888P"`Y8P"Y8888P"`Y88P""Y8888P"Y8888P'   8I   `Y88P""Y8 
       ,d8I'                                                                       
     ,dP'8I                                                                        
    ,8"  8I                                                                        
    I8   8I                                                                        
    `8, ,8I                                                                        
     `Y8P"                                                                       

spit out some linear gradients for pretty page backgrounds. 
Sarah Imrisek 2018
pretty ascii header in 'nvscript' c/o http://www.kammerl.de/ascii/AsciiSignature.php

*/

/**
 * Generates a css style string for a linear gradient that starts out white and then randomly shows a bunch of very pale color stripes.
 * -------------------------------------------------------------------------------------------------------------------------------------
 * @param  {String} direction   a css gradient direction string or angle
 * 
 * @return {String}             a css gradient string, e.g. "linear-gradient(to right, red , yellow)"
 */
function randomPastelGradient(direction){
   return randomGradient(direction, "white", xstnt.Colors.randomWhite);
}

/**
 * Generates a css style string for a linear gradient that starts out black and then randomly shows a bunch of dark muted color stripes.
 * -------------------------------------------------------------------------------------------------------------------------------------
 * @param  {String} direction   a css gradient direction string or angle
 * 
 * @return {String}             a css gradient string, e.g. "linear-gradient(to right, red , yellow)"
 */
function randomDarkGradient(direction){
   return randomGradient(direction, "black", xstnt.Colors.randomDarkGrey, 20);
}

/**
 * Generates a css style string for a linear gradient.
 * ------------------------------------------------------
 * @param  {String} direction     a css gradient direction string or angle
 * @param  {String} startingColor color to start with (will take up a larger percentage of the gradient)
 * @param  {String} colorFunc     function to call to pick subsequent colors
 * @param  {String} numColors     OPTIONAL: how many colors in your gradient?  [default is a random number btw 5 and 100]
 * 
 * @return {String}               a css gradient string, e.g. "linear-gradient(to right, red, yellow)"
 */
function randomGradient(direction, startingColor, colorFunc, numColors){
    var MAX_COLORS = 100;
    var numCols = numColors || 5 + Math.floor(Math.random()*(MAX_COLORS-5));
    var MAX_STRIPE_WIDTH = 500/numCols;
    var spaceUsed = 15 + Math.floor(Math.random()*25);
    var firstWhite = startingColor+" "+spaceUsed+"%";

    var gradientString = "linear-gradient("+direction+", "+firstWhite;

    for(var i=0; i<numCols && spaceUsed < 99; i++){

        // pick a random amount of the space left, but not more than MAX_STRIPE_WIDTH% of the screen for one color
        var randomSpace = twoDecimals(Math.min(MAX_STRIPE_WIDTH,Math.random()*((99 - spaceUsed)/2)));

        spaceUsed += randomSpace;

        gradientString += ", "+colorFunc.apply()+" "+spaceUsed+"%";
    }
    gradientString +=")";
    return gradientString;
}

/**
 * Pick an arbitrary angle within the specified range.
 * -------------------------------------------------------
 * @return {int} A number between minAngle and maxAngle.
 */
function randomAngle(minAngle, maxAngle){
    return (minAngle + Math.floor(Math.random()*(maxAngle - minAngle)));
}

/**
 * Round the given number to two decimal points.
 * --------------------------------------------------------
 * @param  {Number} num 
 * @return {Number}     the rounded number
 */
function twoDecimals(num){
    return(Math.floor(num*100)/100);
}
document.body.style.background = randomDarkGradient(randomAngle(95,200)+"deg");

