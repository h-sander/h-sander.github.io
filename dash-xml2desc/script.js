let numVideos, vidTitle = [], videoId = [], step2Html = "";

// Gets playlist data using its ID and YouTube API
function getPlaylistData (id) {
	let http = new XMLHttpRequest();
	let videoUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&key=AIzaSyAlz0tMpkgRIQsZcWK9F7iz3vWpMziyNzg&maxResults=50`;
	localStorage.setItem('playlistRequestUrl', videoUrl);
	http.responseType = "text";
	http.open("GET", videoUrl);
	http.send();
	http.onreadystatechange = function (id) {
		if(http.readyState === XMLHttpRequest.DONE && http.status === 200) {
			const resp = JSON.parse(http.responseText);
			numVideos = resp.items.length;
			localStorage.setItem('numVideos', numVideos);
			localStorage.setItem('storedVidId', JSON.stringify(resp.items[0].snippet.resourceId.videoId));
			for (let i = 0; i < numVideos; i++){
				vidTitle[i] = JSON.stringify(resp.items[i].snippet.title);
				localStorage.setItem(`vidTit${i}`, vidTitle[i]);
				videoId[i] = JSON.stringify(resp.items[i].snippet.resourceId.videoId);
				localStorage.setItem(`vidId${i}`, videoId[i]);
			}
		}
	}
}

// Inserts HTML block for 2nd step
function insertHtml () {
	for (let i = 0; i < numVideos; i++) {
		step2Html += `<div class="class-block">
			<h3>Aula ${i+1}: ${vidTitle[`${i}`]}</h3>
			<label for="formsAula${i}">Link para questionário da aula:</label><br>
			<input type="text" id="formsAula${i}" name="formsAula2" class="text-input-style"
			placeholder="Link para questionário do e-Disciplinas ou Google Forms."><br>
			<label for="matAula${i}">Link para material de apoio:</label><br>
			<input type="text" id="matAula${i}" name="matAula${i}" class="text-input-style"
			placeholder="Link para qualquer PDF, vídeo, site, etc."><br>
		</div>`;
	}
	document.getElementById("step2Form").innerHTML = step2Html;
}

// PRECISAMOS DEIXAR O USUÁRIO INSERIR MAIS MATERIAL DE APOIO

// "Next" button function
function nextStep () {
	let rawUrl = document.getElementById("playlist-url").value;
	id = rawUrl.slice(rawUrl.indexOf("list=") + 5); // Gets playlist ID from URL
	getPlaylistData(id);
	localStorage.setItem('courseName', document.getElementById("nome-disciplina").value);
	localStorage.setItem('courseUrl', document.getElementById("moodle-url").value);
	let delayGen = setTimeout(insertHtml, 500);
	console.log('teste?');
	document.getElementById("tab1").style.display = "none";
	document.getElementById("tab2").style.display = "block";
	document.getElementById("tab2-buttons-block").style.display = "block";
}

// "Previous" button function
function prevStep () {
	document.getElementById("tab1").style.display = "block";
	document.getElementById("tab2").style.display = "none";
	document.getElementById("tab2-buttons-block").style.display = "none";
	document.getElementById("step1Form").submit();
}


// "Create dash" button
function formComplete () {
	for (let i = 0; i < numVideos; i++) {
		localStorage.setItem(`quizAula${i}`, document.getElementById(`formsAula${i}`).value);
		localStorage.setItem(`materialAula${i}`, document.getElementById(`matAula${i}`).value);
	}
	window.open("./dash.html");
	localStorage.removeItem('numVideo');
}

