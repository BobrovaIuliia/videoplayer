(function () {
  'use strict';

  let html = `<figure id="videoContainer">'
  <div id="video-controls-box">
    <div class="row" id="video-content">
      <div class="col-10" id="video-title">
        <span id=title></span>
      </div>
      <div class="row" id="video-picture">
        <div class="load" id="preload">
          <hr />
          <hr />
          <hr />
          <hr />
        </div>
      </div>
    </div>
    <div class="row">
      <span id="progress" class="row">
        <span id="total" class="row">
          <span id="buffered" class="row"><span id="current">​</span></span>
        </span>
      </span>
    </div>
    <div class="row btn-group">
      <button id="playpause" class="paused" type="button"></button>
      <button id="stop" type="button"></button>
      <span id="time">
        <span id="currenttime">00:00</span> /
        <span id="duration">00:00</span>
      </span>
      <span id="free_aria"></span>
      <button id="mute" type="button"></button>
      <!--<button id="volinc" type="button">Vol+</button>
                  <button id="voldec" type="button">Vol-</button>-->
      <div id="volume_range" class="row">
        <div id="volumedecr" class="row"></div>
        <div id="volumeinc" class="row"></div>
      </div>
      <button id="fs" type="button"></button>
    </div>
  </div>
  <video id="video" controls preload="metadata" width="800" height="450">

    <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">
  </video>
</figure>`;

  let div = document.createElement("div");
  div.innerHTML = html;
  document.getElementsByClassName('videoplayer')[0].appendChild(div);

  let supportsVideo = !!document.createElement('video').canPlayType;
  if (supportsVideo) {
    //переменные, указывающая на само видео
    let videoContainer = document.getElementById('videoContainer');
    let video = document.getElementById('video');

    // Скроем стандартные контролы
    video.controls = false;

    //переменные, указывающая на каждую из кнопок
    let playpause = document.getElementById('playpause');
    let stop = document.getElementById('stop');
    let mute = document.getElementById('mute');
    let progress = document.getElementById('current');
    let buffered = document.getElementById('buffered');
    let total = document.getElementById('total');
    let duration = document.getElementById('duration');
    let currentTime = document.getElementById('currenttime');
    let fullscreen = document.getElementById('fs');
    let title = document.getElementById('title');
    let videoContent = document.getElementById('video-controls-box');
    let volumeInc = document.getElementById('volumeinc');
    let volumeDecr = document.getElementById('volumedecr');

    //Установим звук на середину
    video.volume = 0.5;

    //контрол для проигрывания
    playpause.addEventListener('click', function (e) {
      if (video.paused || video.ended) {
        video.play();
        playpause.style.background = 'url(' + 'https://img.icons8.com/ios-glyphs/30/000000/pause.png' + ') no-repeat center';
      } else {
        video.pause();
        playpause.style.background = 'url(' + 'https://img.icons8.com/ios-glyphs/30/000000/play.png' + ') no-repeat center';
      }
      playpause.style.backgroundSize = 'contain';
    });

    //контрол остановки воспроизведения кликом по видео
    video.addEventListener('click', function (e) {
      if (video.paused || video.ended) {
        video.play();
        playpause.style.background = 'url(' + 'https://img.icons8.com/ios-glyphs/30/000000/pause.png' + ') no-repeat center';
      } else {
        video.pause();
        playpause.style.background = 'url(' + 'https://img.icons8.com/ios-glyphs/30/000000/play.png' + ') no-repeat center';
      }
      playpause.style.backgroundSize = 'contain';
    });

    video.addEventListener('loadeddata', function (e) {
      let load = document.getElementById('preload');
      let video_picture = document.getElementById('video-picture');
      video_picture.removeChild(load);
    });

    //контрол остановки воспроизведения и сброса на начало видеоряда
    stop.addEventListener('click', function (e) {
      video.pause();
      video.currentTime = 0;
      progress.value = 0;
      playpause.style.background = 'url(' + 'https://img.icons8.com/ios-glyphs/30/000000/play.png' + ') no-repeat center';
      playpause.style.backgroundSize = 'contain';
    });

    //контрол отключения звука
    mute.addEventListener('click', function (e) {
      video.muted = !video.muted;
      if (video.muted) {
        mute.style.background = 'url(' + 'https://img.icons8.com/ios/30/000000/mute-filled.png' + ') no-repeat center';
      } else {
        mute.style.background = 'url(' + 'https://img.icons8.com/ios-glyphs/30/000000/speaker.png' + ') no-repeat center';
      }
      mute.style.backgroundSize = 'contain';
    });

    volumeInc.addEventListener('click', function (e) {
      alterVolume('+');
    });
    volumeDecr.addEventListener('click', function (e) {
      alterVolume('-');
    });

    //Контрол времени видео
    //oncanplay-момент готовности ролика к проигрыванию
    video.addEventListener("canplay", function () {
      duration.textContent = formatTime(video.duration);
      currentTime.textContent = formatTime(0);
      let sources = video.getElementsByTagName('source');
      sources = sources[0].src.split("/");
      sources = sources[sources.length - 1];
      title.textContent = sources;
    });

    //ontimeupdate-срабатываtn при изменении текущего момента
    //контрол прогрессбара
    video.addEventListener('loadedmetadata', function () {
      progress.setAttribute('max', video.duration);
    });

    //изменение места просмотра по клику
    buffered.addEventListener('click', function (e) {
      let x = (e.offsetX * video.duration) / total.offsetWidth;
      video.currentTime = x;
      this.value = x;
    });

    //буферизация
    video.addEventListener("progress", function () {
      buffered.style.width = video.buffered.end(0) / video.duration * 100 + "%";
    });

    //продолжительность просмотра
    video.addEventListener('timeupdate', function () {
      currentTime.textContent = formatTime(video.currentTime);
      let duration = Math.floor(video.currentTime) / Math.floor(video.duration);
      progress.style.width = Math.floor(duration * total.offsetWidth) + "px";
    });

    //полноэкранный режим
    fs.addEventListener('click', function (e) {
      handleFullscreen();
    });

    document.addEventListener('fullscreenchange', function (e) {
      setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
    });
    document.addEventListener('webkitfullscreenchange', function () {
      setFullscreenData(!!document.webkitIsFullScreen);
    });
    document.addEventListener('mozfullscreenchange', function () {
      setFullscreenData(!!document.mozFullScreen);
    });
    document.addEventListener('msfullscreenchange', function () {
      setFullscreenData(!!document.msFullscreenElement);
    });

    //Регулировка звука
    /**
     * @param {string} dir
     * @returns {void}
     */
    let alterVolume = function (dir) {
      let currentVolume = Math.floor(video.volume * 10) / 10;
      if (dir === '+') {
        if (currentVolume < 1) {
          if (currentVolume < 0.1)
            mute.style.background = 'url(' + 'https://img.icons8.com/ios-glyphs/30/000000/speaker.png' + ') no-repeat center';
          video.volume += 0.1;
          volumeDecr.style.width = volumeDecr.offsetWidth + 10 + "px";
        }
      } else if (dir === '-') {
        if (currentVolume > 0.1) {
          video.volume -= 0.1;
          volumeDecr.style.width = volumeDecr.offsetWidth - 10 + "px";
          mute.style.background = 'url(' + 'https://img.icons8.com/ios-glyphs/30/000000/speaker.png' + ') no-repeat center';
        } else {
          video.volume -= 0.1;
          volumeDecr.style.width = volumeDecr.offsetWidth - 10 + "px";
          mute.style.background = 'url(' + 'https://img.icons8.com/ios/30/000000/mute-filled.png' + ') no-repeat center';
        }
      }
      mute.style.backgroundSize = 'contain';
    }

    //Расчет выводимого времени(перевод в нужный формат mm:ss)
    /**
     * @param {number} time
     * @returns {void}
     */
    function formatTime(time) {
      if (Math.floor(time / 60) < 10)
        var min = "0" + Math.floor(time / 60);
      else
        var min = Math.floor(time / 60);
      if (Math.floor(time % 60) < 10)
        var sec = "0" + Math.floor(time % 60);
      else
        var sec = Math.floor(time % 60);
      return min + ":" + sec;
    }

    // полноэкранный режим
    /**
     * @returns {void}
     */
    let isFullScreen = function () {
      return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
    }


    // Проверям поддерживает ли браузер фулскрин API
    let fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);
    // Если не поддерживает, скрываем кнопку фулскрина
    if (!fullScreenEnabled) {
      fullscreen.style.display = 'none';
    }

    // Контейнер для полноэкранного режима
    /**
     * @param {boolean} state
     * @returns {void}
     */
    let setFullscreenData = function (state) {
      videoContainer.setAttribute('data-fullscreen', !!state);
      let freeArea = document.getElementById('free_aria');
      if (!!state) {
        videoContent.style.width = 100 + "%";
        videoContent.style.height = 100 + "%";
        freeArea.style.width = 70 + "%";
      } else {
        videoContent.style.width = 800 + "px";
        videoContent.style.height = 450 + "px";
        freeArea.style.width = 50 + "%";
      }
    }

    /**
     * @returns {void}
     */
    let handleFullscreen = function () {
      if (isFullScreen()) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        setFullscreenData(false);
      } else {
        if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
        else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
        else if (videoContainer.webkitRequestFullScreen) {
          video.webkitRequestFullScreen();
        } else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
        setFullscreenData(true);
      }
    }
  }
})();