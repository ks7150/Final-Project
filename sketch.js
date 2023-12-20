let numbers = [];
let currentIndex = 0;
let interval;
let flashing = true;
let codelength = 5;

let readyToReceive;
let mSerial;
let connectButton;
let NumberS = 0;
let ConnectS = 1;
let InputS = 2;
let cState = NumberS;
let correctCount = 0;

let fontSize = 200; // Initial font size
let zoomSpeed = 100;

let button;

let img;
// let nimg

function preload() {
  img = loadImage("pattern 1.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  textSize(200);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  interval = setInterval(flashNumber, 1000);

  readyToReceive = false;

  mSerial = createSerial();

  connectButton = createButton("Connect To Serial");
  connectButton.position(width / 2, height / 2);
  connectButton.mousePressed(connectToSerial);

  connectButton.hide();

  ///////////

  button = createButton("AGAIN!!!", "black");
  button.position(200, 200);
  button.hide();

  button.mousePressed(restartProcess1);
}

function restartProcess1() {
  print("ok");
  numbers = [];
  cState = NumberS;
  correctCount = 0;
  currentIndex = 0;
  interval = setInterval(flashNumber, 1000);
  button.hide();

  
}

function restartProcess() {
  background(255, 0, 0);
  textSize(100);
  textAlign(CENTER, CENTER);
  text("Nay", width / 2, height / 2);

  print("restart");
  numbers = [];
  cState = NumberS;
  correctCount = 0;
  currentIndex = 0;
  interval = setInterval(flashNumber, 1000);
}

function receiveSerial() {
  let line = mSerial.readUntil("\n");
  line = trim(line);
  if (!line) return;

  if (line.charAt(0) != "{") {
    print("error: ", line);
    readyToReceive = true;
    return;
  }

  // get data from Serial string
  let data = JSON.parse(line).data;
  print(data);
  /////
  let v2 = data.v2;
  let v3 = data.v3;
  let v4 = data.v4;
  let v5 = data.v5;
  let v6 = data.v6;
  let v7 = data.v7;

  if (v2 == 1 && pv2 == 0) {
    if (numbers[correctCount] == 0) {
      correctCount++;
    } else {
      restartProcess();
    }
  } else if (v3 == 1 && pv3 == 0) {
    if (numbers[correctCount] == 1) {
      correctCount++;
    } else {
      restartProcess();
    }
  } else if (v4 == 1 && pv4 == 0) {
    if (numbers[correctCount] == 2) {
      correctCount++;
    } else {
      restartProcess();
    }
  } else if (v5 == 1 && pv5 == 0) {
    if (numbers[correctCount] == 3) {
      correctCount++;
    } else {
      restartProcess();
    }
  } else if (v6 == 1 && pv6 == 0) {
    if (numbers[correctCount] == 4) {
      correctCount++;
    } else {
      restartProcess();
    }
  } else if (v7 == 1 && pv7 == 0) {
    if (numbers[correctCount] == 5) {
      correctCount++;
    } else {
      restartProcess();
    }
  }

  pv2 = v2;
  pv3 = v3;
  pv4 = v4;
  pv5 = v5;
  pv6 = v6;
  pv7 = v7;

  // serial update
  readyToReceive = true;

  // //////////////////////////////////WORDS ON SCREEN

  if (correctCount === codelength) {
    background(0, 255, 0);
    textSize(100);
    textAlign(CENTER, CENTER);
    text("Yay", width / 2, height / 2);
    button.show();
  } else {
    // background(img);
  }
  // ///////////////////////////////////
}

function flashNumber() {
  if (currentIndex < codelength) {
    let thisnumber = floor(random(codelength));
    background(img);
    textSize(fontSize);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);

    text(thisnumber, width / 2, height / 2);
    currentIndex++;
    numbers.push(thisnumber);

    fontSize += zoomSpeed;
  } else {
    clearInterval(interval);
    flashing = false;
    fontSize = 200;
    setTimeout(clearScreen, 1000);
  }
}

function clearScreen() {
  background(img);
  if (!mSerial.opened()) {
    connectButton.show();
  }
  cState = InputS;
}

function draw() {
  

  if (cState == NumberS) {
  } else if (cState == ConnectS) {
    background(img);
  } else if (cState == InputS) {
    if (mSerial.opened() && readyToReceive) {
      readyToReceive = false;
      mSerial.clear();
      mSerial.write(0xab);
    }

    // update serial: read new data
    if (mSerial.availableBytes() > 8) {
      receiveSerial();
    }
  }
}
function connectToSerial() {
  if (!mSerial.opened()) {
    mSerial.open(9600);

    readyToReceive = true;
    connectButton.hide();
  }
}
