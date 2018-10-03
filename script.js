// Gestiond des différente varation de la même fonction, selon le navigateur
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

// Racourcis pour les div bien utilisé
let player     = document.querySelector('#player')
let playground = document.querySelector('#playground')
let show       = document.querySelector('#show')

let gamepad = null
let speed = 5

// Tableau des inputs
// On va bien séparé le calcul des frame et la gestion des input
// C'est cet objet qui fera le lien
let input = {
  up: false,
  down: false,
  left: false,
  right: false,
  gamepad: {
    up: false,
    down: false,
    left: false,
    right: false
  },
  keyboard: {
    up: false,
    down: false,
    left: false,
    right: false
  },
  click: {
    up: false,
    down: false,
    left: false,
    right: false
  }
}

function movePlayer() {
  let maxx = playground.clientWidth - player.clientWidth
  let maxy = playground.clientHeight - player.clientHeight
  let x = player.getBoundingClientRect().x
  let y = player.getBoundingClientRect().y
  
  if (input.up)    y -= speed
  if (input.down)  y += speed
  if (input.left)  x -= speed
  if (input.right) x += speed

  if (x > maxx) x = maxx
  if (y > maxy) y = maxy
  if (x < 0) x = 0
  if (y < 0) y = 0
  
  player.style.top  = `${y}px`
  player.style.left = `${x}px`
}

function showInput() {
  let showclass = ''
  if (input.up)    showclass += 'up '
  if (input.down)  showclass += 'down '
  if (input.left)  showclass += 'left '
  if (input.right) showclass += 'right '
  show.className = showclass
}
/**
 * Tout ce joue ici, 
 * c'est la fonction qu'on va appeler a chaque frame pour:
 *  - Calculer les differente position en fonctoin des inputs
 *  - Replacer chaque elements
 */
function tick () {
  gpinputs()
  totalInputs()
  movePlayer()
  showInput()
  window.requestAnimationFrame(tick)
}

// Gestion de caffouillage entre clavier et gamepad
function totalInputs() {
  input.up    = input.keyboard.up    || input.gamepad.up    || input.click.up
  input.down  = input.keyboard.down  || input.gamepad.down  || input.click.down
  input.left  = input.keyboard.left  || input.gamepad.left  || input.click.left
  input.right = input.keyboard.right || input.gamepad.right || input.click.right
}

/******************************/
/*     Gestion des events     */
/******************************/

// Clavier input
function keyinput(code, active) {
  switch (code) {
    case 'ArrowUp':
      input.keyboard.up = active
      break
    case 'ArrowDown':
      input.keyboard.down = active
      break
    case 'ArrowLeft':
      input.keyboard.left = active
      break
    case 'ArrowRight':
      input.keyboard.right = active
      break
  }
}
document.addEventListener('keydown', (event) => { keyinput(event.code, true) }) 
document.addEventListener('keyup',   (event) => { keyinput(event.code, false)})

/******************************/
/*     Gestion du gamepad     */
/******************************/

// Recuperation du gp a l'index 1
function gphandle(e, connecting) {
  let gptmp = e.gamepad
  if (gptmp.index != 0) return
  if (connecting) {
    gamepad = gptmp
  } else {
    gamepad = null
  }
}

function gpinputs() {
  let gps = navigator.getGamepads()
  if (!gps || !gps[0]) return
  let gamepad = gps[0]
  input.gamepad.up    = gamepad.buttons[12].pressed || gamepad.axes[1] < -0.25
  input.gamepad.down  = gamepad.buttons[13].pressed || gamepad.axes[1] >  0.25
  input.gamepad.left  = gamepad.buttons[14].pressed || gamepad.axes[0] < -0.25
  input.gamepad.right = gamepad.buttons[15].pressed || gamepad.axes[0] >  0.25 
}

// Event (dis)connect
window.addEventListener("gamepadconnected", e => gphandle(e, true), false)
window.addEventListener("gamepaddisconnected", e => gphandle(e, false), false)

/**********************************/
/* Gestion des events click/touch */
/**********************************/
function clicktouch(position, active) {
  input.click[closest.dataset.direction] = active
}

window.addEventListener('mousedown', function(event) {
  let closest = event.target.closest('.input')
  if (closest) {
    input.click[closest.dataset.direction] = true
  }
})
// On annule tout input click quand ça se souleve
window.addEventListener('mouseup', function(event) {
  input.click.up = false
  input.click.down = false
  input.click.left = false
  input.click.right = false
})

document.querySelectorAll('.input').forEach((el) => {
  el.addEventListener('mousedown',   () => { input.click[el.dataset.direction] = true  }, false)
  el.addEventListener('mouseup',     () => { input.click[el.dataset.direction] = false }, false)
  el.addEventListener('touchstart',  () => { input.click[el.dataset.direction] = true  }, false)
  el.addEventListener('touchend',    () => { input.click[el.dataset.direction] = false }, false)
  el.addEventListener('touchcancel', () => { input.click[el.dataset.direction] = false }, false)
  el.addEventListener('touchleave',  () => { input.click[el.dataset.direction] = false }, false)
})

/**********************/
/*                    */
/*      GO GO GO      */
/*                    */
/**********************/
window.requestAnimationFrame(tick)
