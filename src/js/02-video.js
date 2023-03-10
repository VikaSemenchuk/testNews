import Player from '@vimeo/player';
import throttle from 'lodash.throttle';
import localStorageService from './localStorage';

const iframe = document.querySelector('iframe');
const player = new Player(iframe);
const localStorageKey = 'videoplayer-current-time';



player.on('timeupdate', throttle(onSaveStorage, 1000));

function onSaveStorage(event) {
  localStorageService.save(localStorageKey, event.seconds);
  // localStorage.setItem(localStorageKey, event.seconds)

  if (event.seconds === event.duration) {// або event.percent === 1
     
    localStorageService.remove(localStorageKey);
    // localStorage.removeItem(localStorageKey)
  }
}

setCurrentTime();

function setCurrentTime() {
  const saveTime = localStorageService.load(localStorageKey);
  if (saveTime) {
    player.setCurrentTime(saveTime);
  }
}

const seeDuration = player.getDuration();
console.log(seeDuration);