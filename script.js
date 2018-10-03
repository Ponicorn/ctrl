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
  right: false
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
  movePlayer()
  gpinputs()
  showInput()
  window.requestAnimationFrame(tick)
}

window.requestAnimationFrame(tick)


/******************************/
/*     Gestion des events     */
/******************************/

// Clavier input
function keyinput(code, active) {
  switch (code) {
    case 'ArrowUp':
      input.up = active
      break
      case 'ArrowDown':
      input.down = active
      break
    case 'ArrowLeft':
      input.left = active
      break
    case 'ArrowRight':
      input.right = active
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
  input.up    = gamepad.buttons[12].pressed || gamepad.axes[1] < -0.25
  input.down  = gamepad.buttons[13].pressed || gamepad.axes[1] >  0.25
  input.left  = gamepad.buttons[14].pressed || gamepad.axes[0] < -0.25
  input.right = gamepad.buttons[15].pressed || gamepad.axes[0] >  0.25 
}

// Event (dis)connect
window.addEventListener("gamepadconnected", e => gphandle(e, true), false)
window.addEventListener("gamepaddisconnected", e => gphandle(e, false), false)