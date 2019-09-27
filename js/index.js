var circulos = new Array(); // []
var frecuencias = [110, 130, 146, 164, 196, 220, 261, 293, 329, 392, 440, 523, 587, 659, 783];
var osc;
var rampTime = 1;
var timeFromNow = 1;
var env;
var delay;
var reverb;
var hit = false; 
var nuevaPelotaX;
var nuevaPelotaY;
var sliderDiameter;
var sliderFeedback;
var sliderTime;
var sliderAttack;
var sliderSustain;
var sliderDecay;
var sliderRelease;
var smoothedTime = 0;
var boton; 
var canvas;
var xcanvas;
var ycanvas;
var waveform;
var checkbox;
var sine;
var square;
var triangle;
var sawtooth;
var context = new AudioContext();
var divDiameterSlider;
var divCheckbox;
var divSelectWaveform;
var divTimeSlider;
var divFeedBackSlider;
var divReverbSlider;
var divattackSlider;
var divdecaySlider;
var divsustainSlider;
var divreleaseSlider;

function setup(){

	canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent("myContainer");
	centerCanvas();
	textFont("Helvetica");

	divDiameterSlider = document.getElementById("diameterSlider");
	divCheckbox = document.getElementById("checkbox");
	divSelectWaveform = document.getElementById("selectWaveform");;
	divTimeSlider = document.getElementById("timeSlider");;
	divFeedBackSlider = document.getElementById("feedbackSlider");;
	divReverbSlider = document.getElementById("reverbSlider");;
	divAttackSlider = document.getElementById("attackSlider");;
	divDecaySlider = document.getElementById("decaySlider");;
	divSustainSlider = document.getElementById("sustainSlider");;
	divReleaseSlider = document.getElementById("releaseSlider");;
	
	window.onload = function() {
	  context;
	}
	
	document.querySelector('body').addEventListener('click', function() {
 	 context.resume().then(() => {
   	 //console.log('Playback resumed successfully');
	 });
	});

	waveform = createSelect();
	//waveform.position(120,650);
	var options = ['square','sine','triangle','sawtooth'];
	for (var i = 0; i < options.length; i++) {
	var option = createElement('option');
	option.attribute('value', options[i]);
	option.html(options[i]);
	option.parent(waveform);
	}
	waveform.parent(divSelectWaveform);

	checkbox = createInput(0,1,0);               
	checkbox.attribute("type","checkbox");     
	//checkbox.position(115,700);
	checkbox.attribute('checked', null);  
	checkbox.parent(divCheckbox);

	sliderDiameter = createSlider(5, 100, 25);
	//sliderDiameter.position(115, 80);
	sliderDiameter.style('width', '80px');
	sliderDiameter.style('height', '7px');
	sliderDiameter.parent(divDiameterSlider);

	sliderFeedback = createSlider(0, 85, 30);
	//sliderFeedback.position(115, 150);
	sliderFeedback.style('width', '80px');
	sliderFeedback.style('height', '7px');
	sliderFeedback.parent(divFeedBackSlider);

	sliderTime = createSlider(0, 90, 80);
	//sliderTime.position(115, 220);
	sliderTime.style('width', '80px');
	sliderTime.style('height', '7px');	
	sliderTime.parent(divTimeSlider);

	sliderReverb = createSlider(0, 100, 50);
	//sliderReverb.position(115, 290);
	sliderReverb.style('width', '80px');
	sliderReverb.style('height', '7px');
	sliderReverb.parent(divReverbSlider);

	sliderAttack = createSlider(0, 3, 0, 0);
	//sliderAttack.position(115, 360);
	sliderAttack.style('width', '80px');
	sliderAttack.style('height', '7px');
	sliderAttack.parent(divAttackSlider);

	sliderDecay = createSlider(0, 0.5, 0.5, 0);
	//sliderDecay.position(115, 440);
	sliderDecay.style('width', '80px');
	sliderDecay.style('height', '7px');
	sliderDecay.parent(divDecaySlider);

	sliderSustain = createSlider(0, 1, 0.5, 0);
	//sliderSustain.position(115, 510);
	sliderSustain.style('width', '80px');
	sliderSustain.style('height', '7px');
	sliderSustain.parent(divSustainSlider);

	sliderRelease = createSlider(0, 5, 0.5, 0);
	//sliderRelease.position(115, 580);
	sliderRelease.style('width', '80px');
	sliderRelease.style('height', '7px');
	sliderRelease.parent(divReleaseSlider);

	env = new p5.Env();
	env.setADSR(0.05, 0.1, 0.05, 0.05);
	env.setRange (0.3,0);

	osc = new p5.Oscillator();
	osc.amp(env);
	osc.start();

	delay = new p5.Delay();
	delay.process(osc, sliderTime.value()/100, sliderFeedback.value()/100, 10000);
	delay.connect(reverb);

	reverb = new p5.Reverb();
	reverb.process(osc, 6, 6);
	reverb.amp(sliderReverb.value()/100);
	reverb.connect();
}

var estoyFueraDelBoton = true;
boton = document.getElementById("boton");
boton.addEventListener("mouseover", RespondMouseOver); 
boton.addEventListener("mouseout", RespondMouseOut); 

function RespondMouseOver() {
	estoyFueraDelBoton = false;
} 

function RespondMouseOut() { 
	estoyFueraDelBoton = true;
} 

var estoyFueraDelSideNav = true;
boton = document.getElementById("mySidenav");
boton.addEventListener("mouseover", RespondMouseOver1); 
boton.addEventListener("mouseout", RespondMouseOut1); 

function RespondMouseOver1() {
	estoyFueraDelSideNav = false;
} 

function RespondMouseOut1() { 
	estoyFueraDelSideNav = true;
} 

function openNav() {
	document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
	document.getElementById("mySidenav").style.width = "0";
}

function centerCanvas() {
	xcanvas = (windowWidth - width) / 2;
	ycanvas = (windowHeight - height) / 2;
	canvas.position(xcanvas, ycanvas);
}

function windowResized() {
	centerCanvas();
}

function mousePressed() {
	if(mouseX && estoyFueraDelSideNav && estoyFueraDelBoton && mouseX <= canvas.width && mouseY <= canvas.height){
		nuevaPelotaX = mouseX;
		nuevaPelotaY = mouseY;
	}
}

function mouseReleased(){
	if(mouseX && estoyFueraDelSideNav && estoyFueraDelBoton){
		if (mouseX <= canvas.width || mouseX >= 0 && mouseY <= canvas.height || mouseY >= 0){
			creaPelota();
		}
	}
	nuevaPelotaX = undefined;
	nuevaPelotaY = undefined;	
}

function creaPelota() {
	if(mouseX && estoyFueraDelSideNav && estoyFueraDelBoton){
		if (nuevaPelotaX != mouseX || nuevaPelotaY != mouseY){
			circulos.push({
				"x":mouseX,
				"y":mouseY,
				"d":(sliderDiameter.value()),
				"speedX":(nuevaPelotaX - mouseX) / 30,
				"speedY":(nuevaPelotaY - mouseY) / 30,
				"color":[0, 0, 0]
			});
		}
	}
}

function draw(){

	reverb.amp(sliderReverb.value()/100)
	var diameter = sliderDiameter.value();
	env.setADSR(sliderAttack.value(), sliderDecay.value(), sliderSustain.value(), sliderRelease.value());
	background(255, 255, 255);
	var frecuencia = frecuencias[Math.floor(Math.random()*frecuencias.length)];
	osc.setType(waveform.value());
	delay.process(osc, sliderTime.value()/100, sliderFeedback.value()/100, 20000);

	if (circulos.length < 1) {
		fill(0);
		textAlign(CENTER);
		textSize(40);
		textFont("Darker Grotesque, sans-serif");
		text("hold the left mouse button and drag the mouse to start", canvas.width/2, canvas.height/2);
    }

	if (mouseIsPressed){
		if(mouseX && estoyFueraDelSideNav && estoyFueraDelBoton){
			if(nuevaPelotaX <= canvas.width || nuevaPelotaX >= 0 && nuevaPelotaY <= canvas.height || nuevaPelotaY >= 0){
				ellipse(nuevaPelotaX, nuevaPelotaY, 8, 8);
				ellipse(mouseX, mouseY, diameter, diameter);
				line(nuevaPelotaX, nuevaPelotaY, mouseX, mouseY);
			}
		}
	}
		
	for (var i = 0; i < circulos.length; i++) {
        	for (var j = i+1; j < circulos.length; j++){
				hit = collideCircleCircle(circulos[i].x, circulos[i].y, circulos[i].d, circulos[j].x, circulos[j].y, circulos[j].d);
				if (hit == true) {
					env.play();
					//console.log(circulos[i].y, circulos[j].y);
					if (checkbox.elt.checked) {                           
						osc.freq(frecuencia);
						checkbox.value("on");
					} else {
						osc.freq(circulos[i].y + 60);
						checkbox.value("off");       
					}
					hit = false;
					background(random(0, 255), random(0, 255),random(0, 255));
				}
    		}

		fill(circulos[i].color[0], circulos[i].color[1], circulos[i].color[2])
		ellipse(circulos[i].x, circulos[i].y, circulos[i].d, circulos[i].d)
		circulos[i].x += circulos[i].speedX;
		circulos[i].y += circulos[i].speedY;

		//para que las pelotas reboten
		if (circulos[i].x >= canvas.width || circulos[i].x <= 0)  {
			circulos[i].speedX = -circulos[i].speedX;
		}

		if (circulos[i].y >= canvas.height || circulos[i].y <= 0)  {
			circulos[i].speedY = -circulos[i].speedY;
		}
	}
}


