const inputs = document.querySelectorAll('.filters input');
const outputs = document.querySelectorAll('output');
function updateFilter(){
  const suffix = this.dataset.sizing || '';
  document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
  inputs.forEach(input => input.nextElementSibling.value = input.value);
}
inputs.forEach(input => input.addEventListener('change', updateFilter));
inputs.forEach(input => input.addEventListener('mousemove', updateFilter));

const btnReset = document.querySelector('.btn-reset');
btnReset.addEventListener('click', reset);

function reset(){
  document.documentElement.style.setProperty(`--blur`, 0 + 'px');
  document.documentElement.style.setProperty(`--invert`, 0 + '%');
  document.documentElement.style.setProperty(`--sepia`, 0 + '%');
  document.documentElement.style.setProperty(`--saturate`, 100 + '%');
  document.documentElement.style.setProperty(`--hue`, 0 + 'deg');
  inputs.forEach(input=> input.value = input.defaultValue);
  outputs.forEach(output=> output.value = output.defaultValue);
}

const btnNext = document.querySelector('.btn-next');
btnNext.addEventListener('click', getImage);

var count = 0;
var img = document.getElementsByTagName("img")[0];
function getImage() {
  var date = new Date();
  hour = date.getHours();
  if (hour >= 6 && hour <= 11) time = 'morning';
  else if (hour >= 12 && hour <= 17) time = 'day';
  else if (hour >= 18 && hour <= 23) time = 'evening';
  else time = 'night';
  count++;
  if (count > 20) count = 1;
  if(count <= 9) count = `0${count}`;
  img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${time}/${count}.jpg`;
} 

const fileInput = document.querySelector('input[type="file"]');

fileInput.addEventListener('change', function() { 
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    img.src = reader.result;
  }
  reader.readAsDataURL(file);
  fileInput.value = "";
});

const btnFullScreen = document.querySelector('.fullscreen');

btnFullScreen.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}, false);

;
const btnSave = document.querySelector('.btn-save');
btnSave.addEventListener("click", save);
function save(){
    var canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    const imgForSave = new Image();
    imgForSave.setAttribute('crossOrigin', 'anonymous'); 
    imgForSave.src = img.src;
    imgForSave.onload = function() {
        canvas.width = imgForSave.width;
        canvas.height = imgForSave.height;
        ctx.filter = getComputedStyle(img).filter;
        let d1 = Math.sqrt(imgForSave.width * imgForSave.width + imgForSave.height * imgForSave.height)
        let d2 = Math.sqrt(img.width * img.width + img.height * img.height)
        let koef_height = imgForSave.height/img.height
        let koef_width = imgForSave.width/img.width
        let koef = koef_width >= koef_height? koef_width: koef_height;
        ctx.filter = ctx.filter.replace(/blur\(.*px\)/gi, `blur(${parseInt( document.documentElement.style.getPropertyValue('--blur')) * koef}px)`); //*1.77
        ctx.drawImage(imgForSave, 0, 0);
        var link = document.createElement('a');
        link.download = 'download.png';
        link.href = canvas.toDataURL();
        link.click();
        link.delete;
      };  
}


