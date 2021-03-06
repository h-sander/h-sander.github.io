// Goes to quizz, don't remember why i'm doing it with JS
function maisClick(){
  document.getElementById('mais-link').click();
}


// Goes back to top, don't remember why i'm doing it with JS too
function voltarAoTopoClick(){
  document.getElementById('voltarAoTopo').click();
}

// Transforms array texts in empty strings
function notText(array) {
  let regex4 = /\d:\d/;
  for (let j = 0; j < array.length; j++){
    let result4 = regex4.exec(array[j]);
    if (result4 === null) {
      array[j] = "";
    }
  }
}

// Changes stored video ID, sets video number and reloads page
function myfunc(id, N) {
  localStorage.setItem('storedVidId', '"' + id + '"');
  localStorage.setItem('numVideo', N);
  console.log(N);
  window.location.reload();
}

// Gets data from localStorage if varRead wasn't defined
if (typeof varRead === "undefined") {
  window.moodleUrl = localStorage.getItem('courseUrl');
  window.nomeCurso = localStorage.getItem('courseName');
  window.videoID = localStorage.getItem('storedVidId').substring(1, localStorage.getItem('storedVidId').length - 1);
  window.videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=AIzaSyAlz0tMpkgRIQsZcWK9F7iz3vWpMziyNzg`;
  window.passedUrl = localStorage.getItem("playlistRequestUrl"); 
  window.playlistUrl = passedUrl;
  window.numVideos = localStorage.getItem('numVideos');
  window.quizUrl = [];
  window.idVideo = [];
  window.titleVideo = [];
  window.matAula = [];
  window.matAulaPass = [];
  for (let i = 0; i < numVideos; i++) {
    quizUrl[i] = localStorage.getItem(`quizAula${i}`);
    quizUrl[i] =  '"' + quizUrl[i] + '"'; // Quotes must be added to some variables
    idVideo[i] = localStorage.getItem(`vidId${i}`);
    titleVideo[i] = localStorage.getItem(`vidTit${i}`);
    matAula[i] = localStorage.getItem(`materialAula${i}`);
    matAulaPass[i] = '"' + matAula[i] + '"';
  }
}

// Sets nVideo correctly (number of the embedded video)
if (localStorage.getItem('numVideo') === null) {
  window.nVideo = 0;
} else {
  window.nVideo = localStorage.getItem('numVideo');
}

// Video ID without quotes
let idVideoCorr = [];

// Remove quotes from video ID strings
for (let i = 0; i < idVideo.length; i++){
  idVideoCorr[i] = idVideo[i].substring(1, idVideo[i].length - 1);
}

// URL to extract video data
videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${idVideoCorr[`${nVideo}`]}&key=AIzaSyAlz0tMpkgRIQsZcWK9F7iz3vWpMziyNzg`;

// Adds quizz URL to quizz iframe and forces it to reload
document.getElementById('quizz').contentDocument.location.reload(true);
document.getElementById('quizz').src = quizUrl[nVideo].substring(1, quizUrl[nVideo].length - 1);

document.getElementById("course-name").innerHTML += nomeCurso;
const videoConfig = '&autoplay=1&rel=0'; //CONFIGURA????ES DO V??DEO
const playlistId = 'PLEQweGGiJjCQzU5TCvVg6XY1WM0MkUeJZ';
document.getElementById('xtra-material-button').href = matAula[nVideo];
document.getElementById('moodle-button').href = moodleUrl;

document.getElementById('vid-frame').src += idVideoCorr[nVideo]; // ADICIONA O ID DO V??DEO AO IFRAME NO HTML

document.getElementById('vid-frame').src += "?start=1&rel=0"; // INICIA O V??DEO NO SEGUNDO 1 (ALGUNS BUGS ESTAVAM OCORRENDO SEM ESSA CONFIGURA????O) E REMOVE V??DEOS SUGERIDOS DE OUTROS CANAIS

let Http = new XMLHttpRequest();
let Http2 = new XMLHttpRequest();

// Get video data
Http.responseType = "text";
Http.open("GET", videoUrl);
Http.send();

// Get playlist data
Http2.responseType = "text";
Http2.open("GET", playlistUrl);
Http2.send();

// Function to create new JS file (varFile.js)
$("#newFile").click(function() { 
  var blob = new Blob([`const matAula = [${matAulaPass}]; const quizUrl = [${quizUrl}]; const idVideo = [${idVideo}]; const titleVideo = [${titleVideo}]; const playlistUrl = "${playlistUrl}"; const nomeCurso = "${nomeCurso}"; const moodleUrl = "${moodleUrl}"; const numVideos = ${numVideos}; let videoID = "${videoID}"; let videoUrl = "${videoUrl}"; let passedUrl = "${passedUrl}"; let varRead = "lido";`], {type: "text/javascript"});
  saveAs(blob, "varFile.js");
  var downloading = browser.downloads.download({
    url : "./dash.html",
    filename : 'index.html',
    conflictAction : 'uniquify'
  });
});

// This code block is executed when Http2 readyState property is modified
Http2.onreadystatechange = function () {
  if(Http2.readyState === XMLHttpRequest.DONE && Http2.status === 200) {
    const j = JSON.parse(Http2.responseText);
    let vidTitle = [], vidId = [], videoListHtml = "";
    let loopTamanho = j.items.length;
    for (let i = 0; i < loopTamanho; i++) {
      vidTitle[i] = JSON.stringify(j.items[i].snippet.title).substring(1, JSON.stringify(j.items[i].snippet.title).length - 1);
      vidId[i] = JSON.stringify(j.items[i].snippet.resourceId.videoId);
      let vidIdUn = vidId[i];
      vidIdUn =  vidIdUn.substring(1, vidIdUn.length - 1);
      if (i == loopTamanho - 1) {
        videoListHtml += `<div class="titulo-video" onclick="myfunc('${vidIdUn}', ${i})">Aula ${i+1}</div><div class="information">${vidTitle[`${i}`]}</div><br>`;
      } else {
        videoListHtml += `<div class="titulo-video" onclick="myfunc('${vidIdUn}', ${i})">Aula ${i+1}</div><div class="information">${vidTitle[`${i}`]}</div><br>`;
      }
    }
    document.getElementById("list-vid").innerHTML = videoListHtml;
  }
} 

// This code block is executed when Http readyState property is modified
// It's slightly more complicated, because it extracts video chapters data
Http.onreadystatechange = function () {
  if(Http.readyState === XMLHttpRequest.DONE && Http.status === 200) {

    // Gets video description
    const j = JSON.parse(Http.responseText), desc = JSON.stringify(j.items[0].snippet.description);
    const title = JSON.stringify(j.items[0].snippet.title); // Gets video title
    const titleLength = title.length;
    const titleString = title.substring(1,titleLength-1);

    //Finds every correspondence for indicated regex
    const regex1 = /\d:\d/gi;
    let linha = [], result1;
    while ( (result1 = regex1.exec(desc)) ) {
      linha.push(result1.index);
    }

    let min = [], sec = [], hora = [], capName = [], startChapterInd, chaptersHtml = "", finalChapterInd;

    //verifica se ??ltima correspond??ncia [NUMERO]:[NUMERO] ?? na ??ltima linha
    if (desc.indexOf("\\n", linha[linha.length - 1]) === -1){ //?? na ??ltima linha
      finalChapterInd = desc.length - 1;
    } else { //n??o ?? na ??ltima linha
      finalChapterInd = desc.indexOf("\\n", linha[linha.length - 1]);
    }

    //verifica se primeira correspond??ncia [NUMERO]:[NUMERO] ?? na primeira linha
    switch (linha[0]) {
      case 1: //?? na primeira linha ([NUMERO]:[NUMERO])
        startChapterInd = 1;
        break;
      case 2: //?? na primeira linha ([NUMERO][NUMERO]:[NUMERO])
        startChapterInd = 2;
        break;
      default: //n??o ?? na primeira linha
        let auxString = desc.substring(linha[0]-6);
        startChapterInd = auxString.indexOf("\\n") + linha[0] - 4;
    }

    //pega parte da descri????o com timestamps e cap??tulos
    let chapters = desc.substring(startChapterInd,finalChapterInd);

    //separa cada linha
    let lineNotFiltered = chapters.split("\\n");

    //filtra linhas que n??o t??m [NUMERO]:[NUMERO]
    notText(lineNotFiltered);

    //filtra linhas vazias
    let line = lineNotFiltered.filter(Boolean);


    for (let i = 0; i < line.length; i++) {
      const regex3 = /[^:\d]/; //n??o ?? [NUMERO] nem ":"
      const regex5 = /\d/; //[NUMERO]
      let result5 = regex5.exec(line[i]);
      line[i] = line[i].substring(result5.index); //come??a linha no primeiro n??mero achado
      let result3 = regex3.exec(line[i]);
      let tempo = line[i].substring(0, result3.index); //string tempo termina no primeiro n??o n??mero E n??o ":"
      let tempoSeparado = tempo.split(":"); //separa tempo a cada ":"
      switch (tempoSeparado.length) {
        case 2: //n??o tem hora
          hora[i] = 0;
          min[i] = Number(tempoSeparado[0]);
          sec[i] = Number(tempoSeparado[1]);
          break;
        case 3: //tem hora
          hora[i] = Number(tempoSeparado[0]);
          min[i] = Number(tempoSeparado[1]);
          sec[i] = Number(tempoSeparado[2]);
          break;
      }
      const regex2 = /[a-z0-9]/i; //n??mero ou letra
      let auxString2 = line[i].substring(result3.index); //string auxiliar come??a no primeiro n??o n??mero E n??o ":"
      let result2 = regex2.exec(auxString2);

      //nome do cap??tulo come??a no primeiro n??mero ou letra encontrado em auxString2
      capName[i] = auxString2.substring(result2.index);

      //cria html a ser adicionado
      chaptersHtml += `<tr><td class="chapter-name"><a
      onClick="document.getElementById('vid-frame').src='https://youtube.com/embed/' +
      videoID + '?start=' + '${hora[`${i}`]*3600+min[`${i}`]*60+sec[`${i}`]}' +
      videoConfig">${capName[`${i}`]}</a></td><td class="bullet">&#8226</td></tr>`;
    }

    // Adds chapters HTML to dash.html
    document.getElementById("list-table").innerHTML = chaptersHtml;

    // Adds page title to dash.html
    document.getElementById("titulo").innerHTML = titleString;
  }
}

