hexes =     [
    "#6082b6", //00_Glaucous
    "#E48400", //01_Fulvous
    "#16161D", //02_Eigengrau
    "#40826D", //03_Viridian
    "#FFC40C", //04_MikadoYellow
    "#0099EE", //05_Pervenche
    "#DF00FF", //08_Phlox
    "#E52B50", //09_Amaranth
    "#3AB09E", //10_Keppel
    "#BC3F4A", //11_Sanguine
    "#E3F988", //13_Mindaro
    "#43B3AE", //15_Verdigris
    "#F28500", //16_Tangerine
    "#E63E62", //20_ParadisePink
    "#273C76", //22_Mazarine
    "#8E3A59", //23_Quinacridone
    "#00A86B", //24_Jade
    "#AA0022", //25_Incarnadine
    "#ACE1AF", //28_Celadon
    "#DF73FF", //30_Heliotrope
    "#e6be51", //31_Opriment
    "#1f6be5", //32_Verditer
    "#B7410E", //34_Rust
    "#7FDD4C", //35_Absinthe
    "#FCF75E" //37_Icterine
];

transVal = 1;
transition = (dec)=>{
  transVal*=dec;
  return Math.min(1,transVal);
}    

p5 = new P5()
s0.init({src:p5.canvas})
src(s0)
.out(o0)

p5b = new P5()
s1.init({src:p5b.canvas})
src(s1)
.out(o1)

p5.clear()
p5.hide()

p5b.clear()
p5b.hide()

startTime = time;
c = -1;
period = 10;
fade = 0.996;
hexes2 = hexes.slice();
stripeOrder = [];
randomize = ()=>{
    for(let i=0; i<hexes2.length; i++){
        stripeOrder[i] = i;
    };

    let currentIndex = stripeOrder.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [stripeOrder[currentIndex], stripeOrder[randomIndex]] = [
            stripeOrder[randomIndex], stripeOrder[currentIndex]];
    }
//console.log(stripeOrder[0]); 
}

// fade to gray
fadetogray = ()=>{
  if(!go || c > hexes.length){
    return;
  }
  let switchTime = 0.1;
  timeIn = time - startTime;
  //console.log((timeIn % period < switchTime)+", "+c)
  p5.clear();
  p5.noStroke();
  let action = 5;
  if (timeIn < action){
    activeCol = p5.color("#FFFFFF");
  } else if(timeIn > action && timeIn % period < switchTime && c < hexes.length && !justSwitched){
    justSwitched = true;
    c++;
    activeCol = p5.color(hexes[c % hexes.length]);
    hexes2[c] = "#888888";
    if(soldiersReady){
      s3.src.currentTime = (soldier%14)/28;
      soldier++;
    }
  } else if (c >= hexes.length){
    go = false;
  } else {
    activeCol = p5.color(p5.red(activeCol)*fade, p5.green(activeCol)*fade, p5.blue(activeCol)*fade);
    if(timeIn%period > switchTime){
      justSwitched = false;
    }
  }
  if(c < hexes.length){
    p5.fill(activeCol);
    p5.rect(0,0,window.width,window.height);
  }
}

console.log("helpers loaded");