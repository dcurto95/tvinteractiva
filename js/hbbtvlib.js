/*
 * To use This library, You need to add the OIPF application manager objects to your HTML page,
 * 
 *	<object id="oipfAppMan" type="application/oipfApplicationManager"></object>
 */


/*
 * URL ----> http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8 (NO)
 * url --> http://ccma-tva-int-abertis-live.hls.adaptive.level3.net/int/ngrp:tv3_web/playlist.m3u8
*/



var appManager; 
var length;
var videos;
var isPaused = false;
var isDestroyed = false;
var isBroadcastFS = false;

var updateInfo;

//localStorage.removeItem('info');

function hbbtvlib_red_initialize(){
  //should be called show() function, if not the application will not be shown;
  appManager = document.getElementById('oipfAppMan').getOwnerApplication(document);
  appManager.show();
 
};

window.onload = function(){
  hbbtvlib_red_initialize();
  initButton();

  //Mirem si  no hi ha dades al localStorage
  if (localStorage.getItem('info') === null){

  	loadJSON();

  }else{

  	didResponse(localStorage.getItem('info'));

  }
  
  loadUsersJSON();

  //Listener de tecles 
  document.addEventListener("keydown", function(e) {


	if (e.keyCode==VK_RED && !isDestroyed ) {	
		var view3 = document.getElementById('view3').style.visibility;

		//Si estem a la vista 3  => reproduir video
		if (view3 ){

			var video = document.getElementById('video');
			if(isPaused){
				video.play(1);
				isPaused = false;
			}else{
				document.getElementById('mybroadcast').style.display="none";
				document.getElementById('mybroadcast').style.visibility="hidden";
			
				document.getElementById('video').style.display = "block";
				document.getElementById('video').style.visibility="visible";
				var selected = document.getElementsByClassName("canal focus");
				var id = selected[0].id;

				video.data= videos[id-1].url;
				video.play(1);
			}
		
		//Sino anem a la vista 2
		}else{
			document.getElementById('divGraphic').innerHTML = "";
			getRandom();
		}
		
	};
	
	//Si apreten OK
	if (e.keyCode==VK_ENTER && !isDestroyed ) {
		
		var view3 = document.getElementById('view3').style.visibility;
		//Si estem a la vista 3 => actualitzem views i reproduim video
		if (view3){
			
			document.getElementById('mybroadcast').style.display="none";
			document.getElementById('mybroadcast').style.visibility="hidden";
			
			document.getElementById('video').style.display = "block";
			document.getElementById('video').style.visibility="visible";
			var selected = document.getElementsByClassName("canal focus");
			var id = selected[0].id;
			var video = document.getElementById('video');

			video.data= videos[id-1].url;
			video.play(1);

			updateView(selected);

		};
		
		var redButtonIsActive = document.getElementById('sync').style.visibility;
		//Sino passem a la vista 3
		if (redButtonIsActive){
			document.getElementById('sync').style.visibility = "hidden";
			document.getElementById('sync').style.visibility="hidden";
			document.getElementById('sync').innerHTML = "";
			document.getElementById('view3').style.visibility="visible";
			var selected = document.getElementsByClassName('canal focus');
			selected[0].children[1].children[1].style.visibility = "visible";
			var desc = document.getElementById('description');
			var id = selected[0].id;
			desc.innerHTML = videos[id-1].description;
			var descview = document.getElementById('counter');
			descview.innerHTML = "Views : " + videos[id-1].views;
			getBroadcast();
		};
		
	};
	
	//Actualitzem el focus i la descripcio
	if (e.keyCode==VK_DOWN && !isDestroyed ) {
		var view3 = document.getElementById('view3').style.visibility;
		if (view3 && !isDestroyed){
			var focus = parseInt(document.getElementsByClassName('focus')[0].id);
			if (focus <= length-1){
				var nextFocus = focus+1;
				var selected = document.getElementsByClassName('canal focus');
				selected[0].children[1].children[1].style.visibility = "hidden";
				document.getElementsByClassName('focus')[0].className = "canal";
				document.getElementById(nextFocus).className = "canal focus";
				var selected = document.getElementsByClassName('canal focus');
				selected[0].children[1].children[1].style.visibility = "visible";
				var desc = document.getElementById('description');
				var descview = document.getElementById('counter');
				var id = selected[0].id;
				desc.innerHTML ="";
				desc.innerHTML = videos[id-1].description;
				descview.innerHTML ="";
				descview.innerHTML = "Views : " + videos[id-1].views;
				document.getElementById('menu').scrollTop += 90;	
			};
		};
		
	};
	
	//Actualitzem el focus i la descripcio
	if (e.keyCode==VK_UP && !isDestroyed ) {
		var view3 = document.getElementById('view3').style.visibility;
		if (view3  && !isDestroyed){
			
			var focus = parseInt(document.getElementsByClassName('focus')[0].id);
			if (focus != 1){
				var nextFocus = focus-1;
				var selected = document.getElementsByClassName('canal focus');
				selected[0].children[1].children[1].style.visibility = "hidden";
				document.getElementsByClassName('focus')[0].className = "canal";
				document.getElementById(nextFocus).className = "canal focus";
				var selected = document.getElementsByClassName('canal focus');
				selected[0].children[1].children[1].style.visibility = "visible";
				var desc = document.getElementById('description');
				var descview = document.getElementById('counter');
				var id = selected[0].id;
				desc.innerHTML ="";
				desc.innerHTML = videos[id-1].description;
				descview.innerHTML ="";
				descview.innerHTML = "Views : " + videos[id-1].views;
				document.getElementById('menu').scrollTop -= 90;
			};
			
		};
		
	};
	
	//Destruim l'aplicacio
	if (e.keyCode==VK_0 && !isDestroyed ) {	
		isDestroyed = true;   
		document.getElementById('black').style.visibility="visible";
		document.getElementById('black').style.zIndex="5";
		document.getElementById('firetv-background-tv').style.visibility="hidden";
		document.getElementById('view3').style.visibility="hidden";
		document.getElementById('view4').style.visibility="hidden";
		document.getElementById('sync').style.visibility="hidden";
		document.getElementById('divGraphic').style.visibility="hidden";
		document.getElementById('video').style.visibility ="hidden";
		var selected = document.getElementsByClassName('canal focus');
		selected[0].children[1].children[1].style.visibility = "hidden";
		document.getElementById('flechas').style.display ="none";	
		document.textContent = '';
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
	    	document.webkitExitFullscreen();
	    } else if (document.mozCancelFullScreen) {
	        document.mozCancelFullScreen();
	    } else if (document.msExitFullscreen) {
	        document.msExitFullscreen();
	    }
	    document.textContent = '';	
		appManager.hide();
		appManager.destroyApplication();
	};

	//Fullscreen
	if(e.keyCode ==VK_BLUE && !isDestroyed ){
		var view3 = document.getElementById('view3').style.visibility =="visible";
		var videoPlaying = document.getElementById('video').style.visibility =="visible";

		if (view3  && !isBroadcastFS){
			document.getElementById('view3').style.visibility="hidden";
			document.getElementById('view4').style.visibility="visible";
			document.getElementById('blueButton').style.visibility ="visible";
			blueButton();
	

			var selected = document.getElementsByClassName("canal focus");
			var id = selected[0].id;
			var video = document.getElementById('video').style.visibility =="visible";
			var broadcast = document.getElementById('mybroadcast').style.visibility =="visible";
			var view4 = document.getElementById('view4');
			var videoFS = document.getElementById('videoFullScreen');

			if (video){
				videoFS.type = "video/mp4";
				videoFS.data = videos[id-1].url;
				videoFS.play(1);

				if (view4.requestFullscreen) {
        			view4.requestFullscreen();
      			} else if (view4.webkitRequestFullscreen) {
	        		view4.webkitRequestFullscreen();
      			} else if (view4.mozRequestFullScreen) {
	          		view4.mozRequestFullScreen();
      			} else if (view4.msRequestFullscreen) {
	        		view4.msRequestFullscreen();
      			}
      			isBroadcastFS=false;

			}else{
				/* NO FUNCIONA EL BIND 
				videoFS.type = "video/broadcast";
				console.log(videoFS);
				videoFS.bindToCurrentChannel();
				*/
				var broadcast = document.getElementById('mybroadcast');
				document.getElementById('view3').style.visibility="visible";
				document.getElementById('view4').style.visibility="hidden";
				if (broadcast.requestFullscreen) {
        			broadcast.requestFullscreen();
      			} else if (broadcast.webkitRequestFullscreen) {
        			broadcast.webkitRequestFullscreen();
      			} else if (broadcast.mozRequestFullScreen) {
          			broadcast.mozRequestFullScreen();
      			} else if (broadcast.msRequestFullscreen) {
        			broadcast.msRequestFullscreen();
      			}
      			isBroadcastFS=true;
			}
			

			/*
			 *En aquest cas s'ha decidit fer amb la vista4 perque es pugui veure el video + boto
			 * Inicialment nomes teniem el video en fullscreen , el problema que tenim al fer-ho aixi
			 * es que en apretar el boto fullscreen el video comença de nou ja que no hem sapigut 
			 *recuperar el temps del video . La funcio video.currentTime no funciona. Tot i aixo hem 
			 * cregut més important que es veies la funcio implementada del boto blau que no pas que el 
			 * video continues pel segon en el que estava abans de premer el boto blau
			 */
	

		}else{
			var view4 = document.getElementById('view4').style.visibility=="visible";
			var view3 = document.getElementById('view4').style.visibility=="visible";
			
			if(view4){

			      if (document.exitFullscreen) {
			        document.exitFullscreen();
			      } else if (document.webkitExitFullscreen) {
			        document.webkitExitFullscreen();
			      } else if (document.mozCancelFullScreen) {
			        document.mozCancelFullScreen();
			      } else if (document.msExitFullscreen) {
			        document.msExitFullscreen();
			      }

				
				document.getElementById('view4').style.visibility="hidden";
				document.getElementById('view3').style.visibility="visible";

			}else{
				if (document.exitFullscreen) {
			        document.exitFullscreen();
			      } else if (document.webkitExitFullscreen) {
			        document.webkitExitFullscreen();
			      } else if (document.mozCancelFullScreen) {
			        document.mozCancelFullScreen();
			      } else if (document.msExitFullscreen) {
			        document.msExitFullscreen();
			      }
			      isBroadcastFS=false;

			}
		}
		
		
	}

	//Pause del video
	if(e.keyCode ==VK_GREEN && !isDestroyed ){
		var view3 = document.getElementById('view3').style.visibility;
		if (view3){

			var video = document.getElementById('video');
			video.play(0);
			isPaused = true;


		}
	}

	//Stop del video 
	if(e.keyCode ==VK_YELLOW && !isDestroyed ){
		var view3 = document.getElementById('view3').style.visibility;
		if (view3){
			
			var video = document.getElementById('video');
			video.stop();
			
			document.getElementById('video').style.display="none";
			document.getElementById('video').style.visibility="hidden";

			document.getElementById('mybroadcast').style.visibility="visible";
			document.getElementById('mybroadcast').style.display="inline";
			getBroadcast();
			
			
		
		}
	}
	
	e.preventDefault();
  },false);
};

//Funció que carrega el broadcast a la vista 3
function getBroadcast(){
	var broadvideo = document.getElementById('mybroadcast');
	broadvideo.bindToCurrentChannel();
}

//Control del botó vermell (timers)
function initButton(){
	var red_button = document.getElementById("redButton");
	
	setTimeout (function() {red_button.style.visibility="hidden";}, 10000); //Mostramos 10s
	setTimeout (function() {red_button.style.visibility="visible";}, 15000); //Escondemos 5s
	setTimeout (function() {red_button.style.visibility="hidden";}, 20000); //Mostramos 5s
	setTimeout (function() {red_button.style.visibility="visible";}, 80000); //Escondemos 1min
	setTimeout (function() {red_button.style.visibility="hidden";}, 85000); //Mostramos 5 segs
}

// Actualitza la vista de sincronització amb el numero resultant
function getRandom(){
	document.getElementById('sync').style.visibility="visible";
	document.getElementById('synctext').innerHTML = getRandomInt(1000,9999);		
}

// Retorna un nombre sencer aleatori entre min (inclòs) i max (exclòs)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//Control del timing del botó blau
function blueButton(){
	var blue_button = document.getElementById("blueButton");
	setTimeout (function() {blue_button.style.visibility="hidden";}, 5000); //Mostramos 10s

} 

//Petició per recuperar el JSON
function loadJSON(){
    var fileName = "data.json";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            didResponse(xmlhttp.responseText);
        }
    }
    xmlhttp.overrideMimeType("application/json");
    xmlhttp.open("GET", "/"+fileName, true);
    xmlhttp.send(); 
}

//Funció que s'encarrega de llegir el JSON i d'omplir la vista3
function didResponse(response){
	var menu = document.getElementById("menu");
    var jsonArray = JSON.parse(response);
    videos = jsonArray.videos;
    length = videos.length;

    
    for (var i = 0; i<videos.length;i++){
    	var artist = videos[i].artist;
    	var title = videos[i].title;
    	var url = videos[i].url;
    	var image = videos[i].image;
    	var description = videos[i].description;
    	var views = videos[i].views;
	
    	var canal = document.createElement('div');
    	canal.className = "canal";
	
    	canal.id = i+1;

    	if (i == 0){
    		canal.className = "canal focus"
    	}else{
    		canal.className = "canal"
    	}
		
    	var divFotografia = document.createElement('div');
    	divFotografia.id = "fotografia";

    	var fotografia = document.createElement('img');
    	fotografia.id = "img-responsive";
    	fotografia.src = image;
    	divFotografia.appendChild(fotografia);
    	canal.appendChild(divFotografia);

    	var divContenido = document.createElement('div');
    	divContenido.id = "contenido";

    	var divInfo = document.createElement('div');
    	divInfo.id = "info";
    	var divAlbumName = document.createElement('div');
    	divAlbumName.id = "AlbumName";
    	var pAlbumName = document.createElement('p');
    	pAlbumName.innerHTML= title;
    	divAlbumName.appendChild(pAlbumName);
    	divInfo.appendChild(divAlbumName);
  
    	var divArtistName = document.createElement('div');
    	divArtistName.id = "ArtistName";
    	var pArtistName = document.createElement('p');
    	pArtistName.innerHTML = artist;
    	divArtistName.appendChild(pArtistName);
    	divInfo.appendChild(divArtistName);

    	divContenido.appendChild(divInfo);
	
    	var divFlechas = document.createElement('div');
    	divFlechas.id = "flechas";
    	var visitas = document.createElement('p');
    	visitas.id = "visitas";
    	visitas.innerHTML = views;

    	var imageFlechas = document.createElement('img');
    	imageFlechas.src = "./img/flechas.png" ;
    	imageFlechas.id = "flechasImg";
    	divFlechas.style.visibility="hidden";
    	
    	divFlechas.appendChild(visitas);
    	divFlechas.appendChild(imageFlechas);
   
    	divContenido.appendChild(divFlechas);
    	canal.appendChild(divContenido);
    	
    	menu.appendChild(canal);
    	
		localStorage.setItem('info', '{"videos":'+ JSON.stringify(videos)+'}');
    }

}
//Petició per recuperar el JSON d'usuaris
function loadUsersJSON(){
	var fileName = "users.json";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            didUsersResponse(xmlhttp.responseText);
        }
    }
    xmlhttp.overrideMimeType("application/json");
    xmlhttp.open("GET", "/"+fileName, true);
    xmlhttp.send(); 
}

//Funció que llegeix el JSON i carrega l'apartat d'usuaris
function didUsersResponse(response){
	var jsonArray = JSON.parse(response);
	users = jsonArray.users;
	var num = users.length;
	var userPanel = document.getElementById("userPanel") ;
	for (var i = 0; i < num ; i++){
		var userName = document.createElement('li');
		var name = users[i].name;
		var lastName = users[i].lastName;	
		userName.innerHTML = name + " " + lastName;
		userPanel.appendChild(userName);
	}
}

//Funció que actualitza les views i actualitza el localStorage
function updateView(selected){
	
	var visitas = selected[0].children[1].children[1].children[0];
	visitas.innerHTML = "";
	videos[selected[0].id - 1].views+=1;
	visitas.innerHTML = videos[selected[0].id - 1].views; 
	localStorage.setItem('info', '{"videos":'+ JSON.stringify(videos)+'}');
  
}
