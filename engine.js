(() => {
  const programInput = document.getElementById("programInput");
  const runBtn = document.getElementById("runBtn");
  const stopBtn = document.getElementById("stopBtn");
  const saveBtn = document.getElementById("saveBtn");
  const loadBtn = document.getElementById("loadBtn");
  const exportHtmlBtn = document.getElementById("exportHtmlBtn");
  const fileInput = document.getElementById("fileInput");
  const highlight = document.getElementById("highlight");
  const lineNumbers = document.getElementById("lineNumbers");
  const canvas = document.getElementById("screen");
  const screenHost = document.getElementById("screenHost");
  const screenSize = document.getElementById("screenSize");
  const popoutBtn = document.getElementById("popoutBtn");
  const spriteEditorBtn = document.getElementById("spriteEditorBtn");
  const spriteEditorModal = document.getElementById("spriteEditorModal");
  const spriteEditorClose = document.getElementById("spriteEditorClose");
  const spriteFileInput = document.getElementById("spriteFileInput");
  const spriteLoadBtn = document.getElementById("spriteLoadBtn");
  const spriteSaveBtn = document.getElementById("spriteSaveBtn");
  const spriteUndoBtn = document.getElementById("spriteUndoBtn");
  const spriteRedoBtn = document.getElementById("spriteRedoBtn");
  const spriteWidthInput = document.getElementById("spriteWidth");
  const spriteHeightInput = document.getElementById("spriteHeight");
  const spriteResizeBtn = document.getElementById("spriteResizeBtn");
  const spriteFrameWInput = document.getElementById("spriteFrameW");
  const spriteFrameHInput = document.getElementById("spriteFrameH");
  const spriteToolBrush = document.getElementById("spriteToolBrush");
  const spriteToolFill = document.getElementById("spriteToolFill");
  const spriteBrushInput = document.getElementById("spriteBrush");
  const spriteColorInput = document.getElementById("spriteColor");
  const spriteGridToggle = document.getElementById("spriteGridToggle");
  const spriteEditorCanvas = document.getElementById("spriteEditorCanvas");
  const spriteGridCanvas = document.getElementById("spriteGridCanvas");
  const spriteCanvasStage = document.getElementById("spriteCanvasStage");
  const spriteDataUrl = document.getElementById("spriteDataUrl");
  const spriteCopyBtn = document.getElementById("spriteCopyBtn");
  canvas.tabIndex = 0;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const spriteCtx = spriteEditorCanvas.getContext("2d");
  spriteCtx.imageSmoothingEnabled = false;
  const spriteGridCtx = spriteGridCanvas.getContext("2d");
  spriteGridCtx.imageSmoothingEnabled = false;
  const originalHost = screenHost;
  const placeholder = document.createElement("div");
  placeholder.style.width = "640px";
  placeholder.style.height = "400px";
  let popoutWindow = null;
  let popoutPoll = null;
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function noteToFrequency(note) {
    const n = Number(note);
    return 261.6255653005986 * Math.pow(2, n / 12);
  }
  const FONT_W = 8;
  const FONT_H = 8;
  const DEFAULT_FONT_DATA = new Uint8Array([
    0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00, 0x7E,0x81,0xA5,0x81,0xBD,0x99,0x81,0x7E,
    0x7E,0xFF,0xDB,0xFF,0xC3,0xE7,0xFF,0x7E, 0x6C,0xFE,0xFE,0xFE,0x7C,0x38,0x10,0x00,
    0x10,0x38,0x7C,0xFE,0x7C,0x38,0x10,0x00, 0x38,0x7C,0x38,0xFE,0xFE,0x92,0x10,0x38,
    0x10,0x38,0x7C,0xFE,0xFE,0x7C,0x10,0x38, 0x00,0x00,0x18,0x3C,0x3C,0x18,0x00,0x00,
    0xFF,0xFF,0xE7,0xC3,0xC3,0xE7,0xFF,0xFF, 0x00,0x3C,0x66,0x42,0x42,0x66,0x3C,0x00,
    0xFF,0xC3,0x99,0xBD,0xBD,0x99,0xC3,0xFF, 0x0F,0x07,0x0F,0x7D,0xCC,0xCC,0xCC,0x78,
    0x3C,0x66,0x66,0x66,0x3C,0x18,0x7E,0x18, 0x3F,0x33,0x3F,0x30,0x30,0x70,0xF0,0xE0,
    0x7F,0x63,0x7F,0x63,0x63,0x67,0xE6,0xC0, 0x99,0x5A,0x3C,0xE7,0xE7,0x3C,0x5A,0x99,
    0x80,0xE0,0xF8,0xFE,0xF8,0xE0,0x80,0x00, 0x02,0x0E,0x3E,0xFE,0x3E,0x0E,0x02,0x00,
    0x18,0x3C,0x7E,0x18,0x18,0x7E,0x3C,0x18, 0x66,0x66,0x66,0x66,0x66,0x00,0x66,0x00,
    0x7F,0xDB,0xDB,0x7B,0x1B,0x1B,0x1B,0x00, 0x3E,0x61,0x3C,0x66,0x66,0x3C,0x86,0x7C,
    0x00,0x00,0x00,0x00,0x7E,0x7E,0x7E,0x00, 0x18,0x3C,0x7E,0x18,0x7E,0x3C,0x18,0xFF,
    0x18,0x3C,0x7E,0x18,0x18,0x18,0x18,0x00, 0x18,0x18,0x18,0x18,0x7E,0x3C,0x18,0x00,
    0x00,0x18,0x0C,0xFE,0x0C,0x18,0x00,0x00, 0x00,0x30,0x60,0xFE,0x60,0x30,0x00,0x00,
    0x00,0x00,0xC0,0xC0,0xC0,0xFE,0x00,0x00, 0x00,0x24,0x66,0xFF,0x66,0x24,0x00,0x00,
    0x00,0x18,0x3C,0x7E,0xFF,0xFF,0x00,0x00, 0x00,0xFF,0xFF,0x7E,0x3C,0x18,0x00,0x00,
    0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00, 0x18,0x3C,0x3C,0x18,0x18,0x00,0x18,0x00,
    0x6C,0x6C,0x24,0x00,0x00,0x00,0x00,0x00, 0x6C,0x6C,0xFE,0x6C,0xFE,0x6C,0x6C,0x00,
    0x18,0x3E,0x60,0x3C,0x06,0x7C,0x18,0x00, 0x00,0x66,0x6C,0x18,0x30,0x6C,0xC6,0x00,
    0x38,0x6C,0x38,0x76,0xDC,0xCC,0x76,0x00, 0x30,0x30,0x60,0x00,0x00,0x00,0x00,0x00,
    0x0C,0x18,0x30,0x30,0x30,0x18,0x0C,0x00, 0x30,0x18,0x0C,0x0C,0x0C,0x18,0x30,0x00,
    0x00,0x66,0x3C,0xFF,0x3C,0x66,0x00,0x00, 0x00,0x18,0x18,0x7E,0x18,0x18,0x00,0x00,
    0x00,0x00,0x00,0x00,0x00,0x18,0x18,0x30, 0x00,0x00,0x00,0x7E,0x00,0x00,0x00,0x00,
    0x00,0x00,0x00,0x00,0x00,0x18,0x18,0x00, 0x06,0x0C,0x18,0x30,0x60,0xC0,0x80,0x00,
    0x7C,0xC6,0xCE,0xDE,0xF6,0xE6,0x7C,0x00, 0x18,0x38,0x18,0x18,0x18,0x18,0x7E,0x00,
    0x7C,0xC6,0x0E,0x1C,0x70,0xC0,0xFE,0x00, 0x7C,0xC6,0x06,0x3C,0x06,0xC6,0x7C,0x00,
    0x1C,0x3C,0x6C,0xCC,0xFE,0x0C,0x1E,0x00, 0xFE,0xC0,0xFC,0x06,0x06,0xC6,0x7C,0x00,
    0x3C,0x60,0xC0,0xFC,0xC6,0xC6,0x7C,0x00, 0xFE,0xC6,0x0C,0x18,0x30,0x30,0x30,0x00,
    0x7C,0xC6,0xC6,0x7C,0xC6,0xC6,0x7C,0x00, 0x7C,0xC6,0xC6,0x7E,0x06,0x0C,0x78,0x00,
    0x00,0x18,0x18,0x00,0x00,0x18,0x18,0x00, 0x00,0x18,0x18,0x00,0x00,0x18,0x18,0x30,
    0x0E,0x18,0x30,0x60,0x30,0x18,0x0E,0x00, 0x00,0x00,0x7E,0x00,0x7E,0x00,0x00,0x00,
    0x70,0x18,0x0C,0x06,0x0C,0x18,0x70,0x00, 0x7C,0xC6,0x0E,0x1C,0x18,0x00,0x18,0x00,
    0x7C,0xC6,0xDE,0xDE,0xDE,0xC0,0x78,0x00, 0x38,0x6C,0xC6,0xC6,0xFE,0xC6,0xC6,0x00,
    0xFC,0x66,0x66,0x7C,0x66,0x66,0xFC,0x00, 0x3C,0x66,0xC0,0xC0,0xC0,0x66,0x3C,0x00,
    0xF8,0x6C,0x66,0x66,0x66,0x6C,0xF8,0x00, 0xFE,0x62,0x68,0x78,0x68,0x62,0xFE,0x00,
    0xFE,0x62,0x68,0x78,0x68,0x60,0xF0,0x00, 0x3C,0x66,0xC0,0xC0,0xCE,0x66,0x3E,0x00,
    0xC6,0xC6,0xC6,0xFE,0xC6,0xC6,0xC6,0x00, 0x7E,0x18,0x18,0x18,0x18,0x18,0x7E,0x00,
    0x1E,0x0C,0x0C,0x0C,0xCC,0xCC,0x78,0x00, 0xE6,0x66,0x6C,0x78,0x6C,0x66,0xE6,0x00,
    0xF0,0x60,0x60,0x60,0x62,0x66,0xFE,0x00, 0xC6,0xEE,0xFE,0xFE,0xD6,0xC6,0xC6,0x00,
    0xC6,0xE6,0xF6,0xDE,0xCE,0xC6,0xC6,0x00, 0x7C,0xC6,0xC6,0xC6,0xC6,0xC6,0x7C,0x00,
    0xFC,0x66,0x66,0x7C,0x60,0x60,0xF0,0x00, 0x7C,0xC6,0xC6,0xC6,0xD6,0xCC,0x7A,0x00,
    0xFC,0x66,0x66,0x7C,0x6C,0x66,0xE6,0x00, 0x7C,0xC6,0x60,0x38,0x0C,0xC6,0x7C,0x00,
    0x7E,0x7E,0x5A,0x18,0x18,0x18,0x3C,0x00, 0xC6,0xC6,0xC6,0xC6,0xC6,0xC6,0x7C,0x00,
    0xC6,0xC6,0xC6,0xC6,0xC6,0x6C,0x38,0x00, 0xC6,0xC6,0xC6,0xD6,0xFE,0xEE,0xC6,0x00,
    0xC6,0xC6,0x6C,0x38,0x6C,0xC6,0xC6,0x00, 0x66,0x66,0x66,0x3C,0x18,0x18,0x3C,0x00,
    0xFE,0xC6,0x8C,0x18,0x32,0x66,0xFE,0x00, 0x78,0x60,0x60,0x60,0x60,0x60,0x78,0x00,
    0xC0,0x60,0x30,0x18,0x0C,0x06,0x02,0x00, 0x78,0x18,0x18,0x18,0x18,0x18,0x78,0x00,
    0x10,0x38,0x6C,0xC6,0x00,0x00,0x00,0x00, 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xFF,
    0x30,0x18,0x0C,0x00,0x00,0x00,0x00,0x00, 0x00,0x00,0x7C,0x06,0x7E,0xC6,0x7E,0x00,
    0xE0,0x60,0x7C,0x66,0x66,0x66,0xDC,0x00, 0x00,0x00,0x7C,0xC6,0xC0,0xC6,0x7C,0x00,
    0x1C,0x0C,0x7C,0xCC,0xCC,0xCC,0x76,0x00, 0x00,0x00,0x7C,0xC6,0xFE,0xC0,0x7C,0x00,
    0x3C,0x66,0x60,0xF8,0x60,0x60,0xF0,0x00, 0x00,0x00,0x76,0xCC,0xCC,0x7C,0x0C,0xF8,
    0xE0,0x60,0x6C,0x76,0x66,0x66,0xE6,0x00, 0x18,0x00,0x38,0x18,0x18,0x18,0x3C,0x00,
    0x0C,0x00,0x0C,0x0C,0x0C,0xCC,0xCC,0x78, 0xE0,0x60,0x66,0x6C,0x78,0x6C,0xE6,0x00,
    0x38,0x18,0x18,0x18,0x18,0x18,0x3C,0x00, 0x00,0x00,0xEC,0xFE,0xD6,0xD6,0xC6,0x00,
    0x00,0x00,0xDC,0x66,0x66,0x66,0x66,0x00, 0x00,0x00,0x7C,0xC6,0xC6,0xC6,0x7C,0x00,
    0x00,0x00,0xDC,0x66,0x66,0x7C,0x60,0xF0, 0x00,0x00,0x76,0xCC,0xCC,0x7C,0x0C,0x1E,
    0x00,0x00,0xDC,0x76,0x66,0x60,0xF0,0x00, 0x00,0x00,0x7E,0xC0,0x7C,0x06,0xFC,0x00,
    0x30,0x30,0xFC,0x30,0x30,0x36,0x1C,0x00, 0x00,0x00,0xCC,0xCC,0xCC,0xCC,0x76,0x00,
    0x00,0x00,0xC6,0xC6,0xC6,0x6C,0x38,0x00, 0x00,0x00,0xC6,0xD6,0xD6,0xFE,0x6C,0x00,
    0x00,0x00,0xC6,0x6C,0x38,0x6C,0xC6,0x00, 0x00,0x00,0xC6,0xC6,0xC6,0x7E,0x06,0xFC,
    0x00,0x00,0xFE,0x4C,0x18,0x32,0xFE,0x00, 0x0E,0x18,0x18,0x70,0x18,0x18,0x0E,0x00,
    0x18,0x18,0x18,0x00,0x18,0x18,0x18,0x00, 0x70,0x18,0x18,0x0E,0x18,0x18,0x70,0x00,
    0x76,0xDC,0x00,0x00,0x00,0x00,0x00,0x00, 0x00,0x10,0x38,0x6C,0xC6,0xC6,0xFE,0x00
  ]);
  const sample = `REM Endless runner demo (paste your sprite data URL below)
CLS()
CLEARSCREEN()

LET SPRDATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABoElEQVR4AbySW27kQAwDN3v/OyepjwIImXI7k4cBgWqRbNGe+f9ved7Hs8jW8bC/b8I1wGb46XkNQPq5qM2mxnPTthn6GuDt84GkPtu3RPpT6UFnLzLLqgFSYHIxuSe9PnF6jgE0bG8gf8LNvwZIQ/anRfLpyV5eXAPkJ8te4wnTk/301QDN0GbzMs9q882dqRFrAMm/wEuALSlh7jj4V+oS4JVLNg+B82douksADNQUM6PmvJ1TRwg0OeNsXQJIiJtRfsP0ZT/1NUCmthfnBd891wBeytJMz1nuK3jnqwHaUmbU08V3S/OOGiAFv93XAC19m23hmrbN8NcA+antRUynSq29OL01QIpMLib3pNcnTs8xgIbtDeRPuPnXAGnI/rRIPj3Zy4trgPxk2Ws8YXqyn74aoBnabF7muWnbDH0NAPFqbYu4r3GXAE2EmbrjnvBNcwmA6LvV/nRtxp5LAIQUZBYzKmezh6fmnDNfD47ibF0CSIjT4PwOWSY//cmhqQEUYbYXMd2VOrwUWlGOmVUDSGLQzIwz+KTUTm3eB/cBAAD//yQAxxwAAAAGSURBVAMApo0UJCUiluAAAAAASUVORK5CYII="
BANKLOADSPRITE(1, SPRDATA, 16, 16)
SPRITEBANK("RUNNER", 1, 0)
SETHOTSPOT("RUNNER", 8, 24)
SETSPRITETRANSFORM("RUNNER", 2, 2, 0, 0, 0)

LET GROUND = 160
LET PLAYERX = 60
LET PLAYERY = GROUND
LET VY = 0
LET GRAV = 0.7
LET JUMP = -10
LET BASESPEED = 3.2
LET FRAME = 0
LET SCORE = 0
LET DEAD = 0
LET STARTED = 0
LET HELD = 0
LET READY = 0
LET NEEDRESET = 1
LET T = 0
LET SNDT = 0

LET OBST = 9
LET OHFIX = 24
LET SPACING = 100
LET NEXTX = 360
DIM OX(OBST - 1)
DIM OH(OBST - 1)

WHILE 1

  CLEARSCREEN()
  LET T = T + 1
  LET SPEED = BASESPEED + (SCORE * 0.06)
  LET GAP = SPACING
	
  BACKDROP()
	HILLS()
	STARS()
	MOON()
	GRASS()
	CONTROLS()
	JUMPCONTROL()
	OBSTACLES()
	PLAYER()
	HUD()

  FLIP()

ENDWHILE
END

//FUNCTIONS

FUNC BACKDROP() //Draw backdrop
	FRECT(0, 0, 320, 200, "#07121c")
END

FUNC OBSTACLES() //Draw obstacles
  FOR I = 0 TO OBST - 1
    IF STARTED == 1 THEN
      OX(I) = OX(I) - SPEED
      IF OX(I) < -20 THEN
        OX(I) = NEXTX
        OH(I) = OHFIX
        NEXTX = NEXTX + GAP + INT(RND() * 30)
        IF DEAD == 0 THEN
          SCORE = SCORE + 1
        ENDIF
      ENDIF
    ENDIF
    FRECT(OX(I), GROUND - OH(I), 12, OH(I), "#8b5a2b")
    RECT(OX(I), GROUND - OH(I), 12, OH(I), "#5a3b1f")

    IF STARTED == 1 THEN
      IF DEAD == 0 THEN
        IF RECTHIT(PLAYERX - 16, PLAYERY - 32, 32, 32, OX(I), GROUND - OH(I), 12, OH(I)) THEN
          DEAD = 1
          STARTED = 0
          NEEDRESET = 1
        ENDIF
      ENDIF
    ENDIF
  NEXT
END

FUNC JUMPCONTROL() //Handle the player jumping
  IF STARTED == 1 THEN
    VY = VY + GRAV
    PLAYERY = PLAYERY + VY
    IF PLAYERY >= GROUND THEN
      PLAYERY = GROUND
      VY = 0
    ENDIF
    SNDT = SNDT + 1
    IF PLAYERY < GROUND THEN
      IF SNDT >= 3 THEN
        IF VY < 0 THEN
          SOUND(2, 12 + INT((-VY) * 2), 0.03)
        ELSE
          SOUND(2, 12 - INT((VY) * 2), 0.03)
        ENDIF
        SNDT = 0
      ENDIF
    ELSE
      SNDT = 0
    ENDIF
  ELSE
    PLAYERY = GROUND
    VY = 0
  ENDIF
END

FUNC PLAYER() //Draw the player
  IF STARTED == 1 THEN
    LET STEP = 6 - INT(SCORE * 0.02)
    IF STEP < 2 THEN
      LET STEP = 2
    ENDIF
    LET FRAME = INT(T / STEP) % 4
    SETSPRITEFRAME("RUNNER", FRAME)
    DRAWSPRITE("RUNNER", PLAYERX, PLAYERY)
  ENDIF
END

FUNC HUD() //Draw the start message and score
  TEXT(10, 10, "SCORE " + SCORE)
  IF STARTED == 0 THEN
    LET MSG1 = "PRESS SPACE"
    LET MSG2 = "TO START"
    LET MX1 = INT((320 - STRLEN(MSG1) * 8) / 2)
    LET MX2 = INT((320 - STRLEN(MSG2) * 8) / 2)
    TEXT(MX1, 90, MSG1)
    TEXT(MX2, 104, MSG2)
  ENDIF
END

FUNC CONTROLS() //Handle player controls
  IF KEYDOWN("Space") == 0 THEN
    READY = 1
    HELD = 0
  ENDIF

  IF KEYDOWN("Space") == 1 THEN
    IF HELD == 0 THEN
      HELD = 1
      IF STARTED == 0 THEN
        IF READY == 1 THEN
          STARTED = 1
          DEAD = 0
          SCORE = 0
          VY = JUMP
          IF NEEDRESET == 1 THEN
            NEXTX = 360
            FOR I = 0 TO OBST - 1
              OX(I) = NEXTX
              OH(I) = OHFIX
              NEXTX = NEXTX + GAP + INT(RND() * 30)
            NEXT
            NEEDRESET = 0
          ENDIF
        ENDIF
      ELSE
        IF DEAD == 0 THEN
          IF PLAYERY >= GROUND THEN
            VY = JUMP
          ENDIF
        ENDIF
      ENDIF
    ENDIF
  ENDIF
END

FUNC GRASS()
  FRECT(0, GROUND, 320, 40, "#1b2f20")
  LINE(0, GROUND, 320, GROUND, "#2f4b2a")
END

FUNC HILLS() //Draw the hills
  FELLIPSE(70 - (T % 320), 150, 70, 18, "#111d2c")
  FELLIPSE(200 - (T * 0.6 % 320), 155, 90, 22, "#0e1a28")
  FELLIPSE(330 - (T * 0.8 % 320), 150, 80, 20, "#111d2c")
END

FUNC STARS() //Draw the stars
  FOR I = 0 TO 14
    LET SX = (I * 23 + T) % 320
    LET SY = 16 + (I * 11) % 50
    FRECT(SX, SY, 1, 1, "#8fb3ff")
  NEXT
END

FUNC MOON() //Draw the moon
	FELLIPSE(260, 40, 20, 20, "#ffe49a")
END`;
  programInput.value = sample;

  function applyScreenSize(mode) {
    if (mode === "1x") {
      canvas.style.width = "320px";
      canvas.style.height = "200px";
      placeholder.style.width = "320px";
      placeholder.style.height = "200px";
    } else {
      canvas.style.width = "640px";
      canvas.style.height = "400px";
      placeholder.style.width = "640px";
      placeholder.style.height = "400px";
    }
  }

  function attachCanvasToHost() {
    if (canvas.ownerDocument !== document) {
      document.adoptNode(canvas);
    }
    if (canvas.parentElement !== originalHost) {
      originalHost.innerHTML = "";
      originalHost.appendChild(canvas);
    }
  }

  function openPopout() {
    if (popoutWindow && !popoutWindow.closed) {
      popoutWindow.focus();
      return;
    }
    popoutWindow = window.open("", "GameBASICScreen", "width=700,height=500,resizable=yes");
    if (!popoutWindow) {
      return;
    }
    popoutWindow.document.title = "GameBASIC Screen";
    popoutWindow.document.body.style.margin = "0";
    popoutWindow.document.body.style.background = state.borderColor || "#0a1018";
    popoutWindow.document.body.style.display = "flex";
    popoutWindow.document.body.style.alignItems = "center";
    popoutWindow.document.body.style.justifyContent = "center";

    attachKeyHandlers(popoutWindow);

    const popoutWrap = popoutWindow.document.createElement("div");
    popoutWrap.style.display = "flex";
    popoutWrap.style.alignItems = "center";
    popoutWrap.style.justifyContent = "center";
    popoutWrap.style.width = "100%";
    popoutWrap.style.height = "100%";
    popoutWindow.document.body.appendChild(popoutWrap);
    popoutWrap.appendChild(canvas);
    canvas.style.imageRendering = "pixelated";
    canvas.style.imageRendering = "crisp-edges";
    canvas.style.borderRadius = "0";
    canvas.style.border = "0";

    const resizePopoutCanvas = () => {
      if (!popoutWindow || popoutWindow.closed) {
        return;
      }
      const maxW = popoutWindow.innerWidth;
      const maxH = popoutWindow.innerHeight;
      const scale = Math.max(1, Math.floor(Math.min(maxW / 320, maxH / 200)));
      canvas.style.width = `${320 * scale}px`;
      canvas.style.height = `${200 * scale}px`;
    };
    resizePopoutCanvas();
    popoutWindow.addEventListener("resize", resizePopoutCanvas);
    const restoreCanvas = () => {
      attachCanvasToHost();
      applyScreenSize(screenSize.value);
    };
    popoutWindow.addEventListener("beforeunload", restoreCanvas);
    popoutWindow.addEventListener("unload", restoreCanvas);
    if (popoutPoll) {
      clearInterval(popoutPoll);
    }
    popoutPoll = setInterval(() => {
      if (!popoutWindow || popoutWindow.closed) {
        clearInterval(popoutPoll);
        popoutPoll = null;
        popoutWindow = null;
        restoreCanvas();
      }
    }, 250);
  }

  const state = {
    vars: {},
    functions: new Map(),
    statements: [],
    running: false,
    pixelMode: 0,
    sprites: new Map(),
    spriteBanks: new Map(),
    tilemaps: new Map(),
    displayOps: [],
    currentLine: null,
    banks: new Map(),
    fontBank: 0,
    borderColor: "#0a1018",
    screenBg: "#0a1018",
    textColor: "#d8f3ff",
    arrays: new Map(),
    dataList: [],
    dataIndex: 0,
    dataIdMap: new Map(),
    keysDown: new Set(),
    lastKey: "",
    inputActive: false,
    inputPrompt: "",
    inputBuffer: "",
    inputCursor: 0,
    inputCursorChar: "_",
    inputResolve: null,
    screenFocused: false,
    targetFps: 60,
    nextFrameTime: 0,
    windows: new Map(),
    currentWindowId: null,
    randomSeed: null,
    random: Math.random
  };

  function makeSeededRng(seed) {
    let t = seed >>> 0;
    return () => {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function setRandomSeed(value) {
    const num = Number(value);
    const seed = Number.isFinite(num) ? Math.floor(num) : Date.now();
    const seed32 = seed >>> 0;
    state.randomSeed = seed32;
    state.random = makeSeededRng(seed32);
    return seed32;
  }

  function resetState() {
    state.vars = {};
    state.functions = new Map();
    state.statements = [];
    state.sprites = new Map();
    state.spriteBanks = new Map();
    state.tilemaps = new Map();
    state.displayOps = [];
    state.currentLine = null;
    state.banks = new Map();
    state.banks.set(0, new Uint8Array(DEFAULT_FONT_DATA));
    state.fontBank = 0;
    state.pixelMode = 1;
    state.dataList = [];
    state.dataIndex = 0;
    state.dataIdMap = new Map();
    state.arrays = new Map();
    state.keysDown = new Set();
    state.lastKey = "";
    state.textColor = "#d8f3ff";
    state.textOutlineColor = null;
    state.textScaleX = 1;
    state.textScaleY = 1;
    state.inputActive = false;
    state.inputPrompt = "";
    state.inputBuffer = "";
    state.inputCursor = 0;
    state.inputCursorChar = "_";
    state.inputMaxLen = null;
    state.inputResolve = null;
    state.screenFocused = false;
    state.targetFps = 60;
    state.nextFrameTime = 0;
    state.windows = new Map();
    state.currentWindowId = null;
    state.randomSeed = null;
    state.random = Math.random;
  }

  function pushDisplayOp(op) {
    state.displayOps.push({ ...op, windowId: state.currentWindowId });
  }

  function printLine(text) {
    pushDisplayOp({ type: "text", text: String(text) });
  }

  function clearOutput() {
    state.displayOps = state.displayOps.filter((op) => op.type !== "text");
  }

  function clearScreen() {
    ctx.fillStyle = state.screenBg || "#0a1018";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function getWindowForOp(op) {
    if (!op || op.windowId === null || op.windowId === undefined) {
      return null;
    }
    return state.windows.get(op.windowId) || null;
  }

  function getWindowRadius(window) {
    const r = Number(window?.r ?? 0) || 0;
    const maxR = Math.max(0, Math.min(window.w, window.h) / 2);
    return Math.max(0, Math.min(r, maxR));
  }

  function addWindowPath(window) {
    const r = getWindowRadius(window);
    const x = window.x;
    const y = window.y;
    const w = window.w;
    const h = window.h;
    const ri = Math.max(0, Math.floor(r));
    if (state.pixelMode && ri > 0) {
      for (let iy = 0; iy < h; iy += 1) {
        let inset = 0;
        if (iy < ri) {
          const dy = ri - iy - 1;
          inset = ri - Math.floor(Math.sqrt(Math.max(0, ri * ri - dy * dy)));
        } else if (iy >= h - ri) {
          const dy = iy - (h - ri);
          inset = ri - Math.floor(Math.sqrt(Math.max(0, ri * ri - dy * dy)));
        }
        const rowW = w - inset * 2;
        if (rowW > 0) {
          ctx.rect(x + inset, y + iy, rowW, 1);
        }
      }
      return;
    }
    if (r <= 0) {
      ctx.rect(x, y, w, h);
      return;
    }
    const r2 = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + r2, y);
    ctx.arcTo(x + w, y, x + w, y + h, r2);
    ctx.arcTo(x + w, y + h, x, y + h, r2);
    ctx.arcTo(x, y + h, x, y, r2);
    ctx.arcTo(x, y, x + w, y, r2);
    ctx.closePath();
  }

  function beginWindowClip(window) {
    if (!window) {
      return false;
    }
    ctx.save();
    ctx.beginPath();
    addWindowPath(window);
    ctx.clip();
    return true;
  }

  function endWindowClip(didClip) {
    if (didClip) {
      ctx.restore();
    }
  }

  const updateScreenFocus = () => {
    const doc = canvas.ownerDocument;
    state.screenFocused = !!(doc && doc.activeElement === canvas);
  };

  canvas.addEventListener("focus", updateScreenFocus);
  canvas.addEventListener("blur", updateScreenFocus);
  canvas.addEventListener("mousedown", () => {
    canvas.focus({ preventScroll: true });
    updateScreenFocus();
  });

  function startInputPrompt(promptText, cursorChar, maxLen) {
    const prompt = String(promptText ?? "INPUT:");
    const cursor = cursorChar === undefined || cursorChar === null
      ? "_"
      : String(cursorChar);
    const limitRaw = maxLen === undefined || maxLen === null ? null : Number(maxLen);
    const limit = Number.isFinite(limitRaw) && limitRaw >= 0 ? Math.floor(limitRaw) : null;
    state.inputActive = true;
    state.inputPrompt = prompt;
    state.inputBuffer = "";
    state.inputCursor = 0;
    state.inputCursorChar = cursor.length > 0 ? cursor[0] : "_";
    state.inputMaxLen = limit;
    state.inputResolve = null;
    state.keysDown.clear();
    state.lastKey = "";
    if (programInput) {
      programInput.blur();
    }
    canvas.focus({ preventScroll: true });
    updateScreenFocus();
    renderDisplay();
    return new Promise((resolve) => {
      state.inputResolve = resolve;
    });
  }

  const handleInputKey = (event) => {
    if (!state.inputActive) {
      return;
    }
    if (!state.screenFocused) {
      updateScreenFocus();
      if (!state.screenFocused) {
        return;
      }
    }
    event.preventDefault();
    event.stopPropagation();
    state.lastKey = event.key.length === 1 ? event.key : event.code;

    if (event.key === "Enter") {
      const prompt = state.inputPrompt || "";
      const buffer = state.inputBuffer || "";
      const lineText = prompt ? `${prompt} ${buffer}` : buffer;
      if (lineText.length > 0) {
        pushDisplayOp({
          type: "text",
          text: lineText,
          color: state.textColor
        });
      }
      const num = Number(buffer);
      const value = Number.isNaN(num) ? buffer : num;
      const resolve = state.inputResolve;
      state.inputActive = false;
      state.inputPrompt = "";
      state.inputBuffer = "";
      state.inputCursor = 0;
      state.inputCursorChar = "_";
      state.inputMaxLen = null;
      state.inputResolve = null;
      renderDisplay();
      if (resolve) {
        resolve(value);
      }
      return;
    }

    if (event.key === "Backspace") {
      if (state.inputCursor > 0) {
        const before = state.inputBuffer.slice(0, state.inputCursor - 1);
        const after = state.inputBuffer.slice(state.inputCursor);
        state.inputBuffer = `${before}${after}`;
        state.inputCursor -= 1;
      }
      renderDisplay();
      return;
    }

    if (event.key === "Delete") {
      if (state.inputCursor < state.inputBuffer.length) {
        const before = state.inputBuffer.slice(0, state.inputCursor);
        const after = state.inputBuffer.slice(state.inputCursor + 1);
        state.inputBuffer = `${before}${after}`;
      }
      renderDisplay();
      return;
    }

    if (event.key === "ArrowLeft") {
      state.inputCursor = Math.max(0, state.inputCursor - 1);
      renderDisplay();
      return;
    }

    if (event.key === "ArrowRight") {
      state.inputCursor = Math.min(state.inputBuffer.length, state.inputCursor + 1);
      renderDisplay();
      return;
    }

    if (event.key.length === 1) {
      if (state.inputMaxLen !== null && state.inputBuffer.length >= state.inputMaxLen) {
        renderDisplay();
        return;
      }
      const before = state.inputBuffer.slice(0, state.inputCursor);
      const after = state.inputBuffer.slice(state.inputCursor);
      state.inputBuffer = `${before}${event.key}${after}`;
      state.inputCursor += 1;
      renderDisplay();
    }
  };

  const handleKeyDown = (event) => {
    if (state.inputActive) {
      if (!state.screenFocused) {
        updateScreenFocus();
        return;
      }
      handleInputKey(event);
      return;
    }
    if (event.target === programInput) {
      return;
    }
    if (event.code === "Space" || event.code.startsWith("Arrow")) {
      event.preventDefault();
    }
    state.keysDown.add(event.code);
    state.lastKey = event.key.length === 1 ? event.key : event.code;
  };

  const handleKeyUp = (event) => {
    if (state.inputActive) {
      return;
    }
    state.keysDown.delete(event.code);
  };

  const attachKeyHandlers = (targetWindow) => {
    targetWindow.addEventListener("keydown", handleKeyDown);
    targetWindow.addEventListener("keyup", handleKeyUp);
  };

  attachKeyHandlers(window);

  function parseBankData(data) {
    if (data instanceof Uint8Array) {
      return data;
    }
    if (typeof data !== "string") {
      throw new Error("BANKLOAD requires a hex or base64 string");
    }
    const trimmed = data.trim();
    if (trimmed.length === 0) {
      return new Uint8Array();
    }
    if (/^(BASE64:|B64:)/i.test(trimmed)) {
      const b64 = trimmed.replace(/^(BASE64:|B64:)/i, "").trim();
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i) & 0xff;
      }
      return bytes;
    }
    const hex = trimmed.replace(/[^0-9a-fA-F]/g, "");
    if (hex.length % 2 !== 0) {
      throw new Error("BANKLOAD hex data must have an even number of digits");
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes;
  }

  function renderDisplay() {
    clearScreen();
    const lineHeight = FONT_H;
    const maxLines = Math.floor(canvas.height / lineHeight);
    const lineIndexMap = new Map();
    const getLineKey = (id) => (id === null || id === undefined ? "__global__" : String(id));

    ctx.textBaseline = "top";

    for (const window of state.windows.values()) {
      if (window && window.bg) {
        ctx.save();
        ctx.beginPath();
        addWindowPath(window);
        ctx.fillStyle = window.bg;
        ctx.fill();
        ctx.restore();
      }
    }

    for (const op of state.displayOps) {
      const window = getWindowForOp(op);
      const baseX = window ? window.x : 0;
      const baseY = window ? window.y : 0;
      const lineKey = getLineKey(op.windowId);
      const windowClip = beginWindowClip(window);
      if (op.type === "text") {
        let lineIndex = lineIndexMap.get(lineKey) ?? 0;
        const scaleX = Number.isFinite(op.scaleX) && op.scaleX > 0 ? op.scaleX : 1;
        const scaleY = Number.isFinite(op.scaleY) && op.scaleY > 0 ? op.scaleY : 1;
        const effectiveFontW = FONT_W * scaleX;
        const lineHeightForOp = FONT_H * scaleY;
        const maxLinesForOp = window ? Math.floor(window.h / lineHeightForOp) : Math.floor(canvas.height / lineHeightForOp);
        const rawCharsPerLine = window
          ? Math.floor(window.w / effectiveFontW)
          : Math.floor(canvas.width / effectiveFontW);
        const charsPerLine = Math.max(1, rawCharsPerLine);
        const lines = [];
        let currentLine = "";
        for (let i = 0; i < op.text.length; i += 1) {
          if (currentLine.length >= charsPerLine) {
            lines.push(currentLine);
            currentLine = "";
          }
          currentLine += op.text[i];
        }
        if (currentLine.length > 0) {
          lines.push(currentLine);
        }
        for (const line of lines) {
          if (lineIndex >= maxLinesForOp) {
            break;
          }
          drawBitmapText(line, baseX, baseY + lineIndex * lineHeightForOp, op.color || state.textColor || "#d8f3ff", op.outlineColor, scaleX, scaleY);
          lineIndex += 1;
        }
        lineIndexMap.set(lineKey, lineIndex);
      } else if (op.type === "textAt") {
        const scaleX = Number.isFinite(op.scaleX) && op.scaleX > 0 ? op.scaleX : 1;
        const scaleY = Number.isFinite(op.scaleY) && op.scaleY > 0 ? op.scaleY : 1;
        drawBitmapText(op.text, baseX + op.x, baseY + op.y, op.color || state.textColor || "#d8f3ff", op.outlineColor, scaleX, scaleY);
      } else if (op.type === "textCenter") {
        const scaleX = Number.isFinite(op.scaleX) && op.scaleX > 0 ? op.scaleX : 1;
        const scaleY = Number.isFinite(op.scaleY) && op.scaleY > 0 ? op.scaleY : 1;
        const width = op.text.length * FONT_W * scaleX;
        const cx = window ? window.w : canvas.width;
        const cy = window ? window.h : canvas.height;
        const x = Math.max(0, Math.floor((cx - width) / 2)) + baseX;
        const height = FONT_H * scaleY;
        const y = op.y !== null ? op.y + baseY : Math.max(0, Math.floor((cy - height) / 2)) + baseY;
        drawBitmapText(op.text, x, y, op.color || state.textColor || "#d8f3ff", op.outlineColor, scaleX, scaleY);
      } else if (op.type === "line") {
        if (state.pixelMode) {
          drawLinePixel(op.x1 + baseX, op.y1 + baseY, op.x2 + baseX, op.y2 + baseY, op.color || state.textColor || "#d8f3ff");
        } else {
          ctx.strokeStyle = op.color || state.textColor || "#d8f3ff";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(op.x1 + baseX + 0.5, op.y1 + baseY + 0.5);
          ctx.lineTo(op.x2 + baseX + 0.5, op.y2 + baseY + 0.5);
          ctx.stroke();
        }
      } else if (op.type === "rect") {
        if (state.pixelMode) {
          strokeRectPixel(op.x + baseX, op.y + baseY, op.w, op.h, op.color || state.textColor || "#d8f3ff");
        } else {
          ctx.strokeStyle = op.color || state.textColor || "#d8f3ff";
          ctx.lineWidth = 1;
          ctx.strokeRect(op.x + baseX + 0.5, op.y + baseY + 0.5, op.w, op.h);
        }
      } else if (op.type === "fillRect") {
        if (state.pixelMode) {
          fillRectPixel(op.x + baseX, op.y + baseY, op.w, op.h, op.color || state.textColor || "#d8f3ff");
        } else {
          ctx.fillStyle = op.color || state.textColor || "#d8f3ff";
          ctx.fillRect(op.x + baseX, op.y + baseY, op.w, op.h);
        }
      } else if (op.type === "ellipse") {
        if (state.pixelMode) {
          strokeEllipsePixel(op.x + baseX, op.y + baseY, op.rx, op.ry, op.color || state.textColor || "#d8f3ff");
        } else {
          ctx.strokeStyle = op.color || state.textColor || "#d8f3ff";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(op.x + baseX, op.y + baseY, op.rx, op.ry, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (op.type === "fillEllipse") {
        if (state.pixelMode) {
          fillEllipsePixel(op.x + baseX, op.y + baseY, op.rx, op.ry, op.color || state.textColor || "#d8f3ff");
        } else {
          ctx.fillStyle = op.color || state.textColor || "#d8f3ff";
          ctx.beginPath();
          ctx.ellipse(op.x + baseX, op.y + baseY, op.rx, op.ry, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (op.type === "arc") {
        if (state.pixelMode) {
          strokeArcPixel(op.x + baseX, op.y + baseY, op.r, op.start, op.end, op.color || state.textColor || "#d8f3ff");
        } else {
          ctx.strokeStyle = op.color || state.textColor || "#d8f3ff";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(op.x + baseX, op.y + baseY, op.r, op.start, op.end);
          ctx.stroke();
        }
      } else if (op.type === "fillArc") {
        if (state.pixelMode) {
          fillArcPixel(op.x + baseX, op.y + baseY, op.r, op.start, op.end, op.color || state.textColor || "#d8f3ff");
        } else {
          ctx.fillStyle = op.color || state.textColor || "#d8f3ff";
          ctx.beginPath();
          ctx.moveTo(op.x + baseX, op.y + baseY);
          ctx.arc(op.x + baseX, op.y + baseY, op.r, op.start, op.end);
          ctx.closePath();
          ctx.fill();
        }
      } else if (op.type === "poly") {
        const points = window
          ? op.points.map((pt) => ({ x: pt.x + baseX, y: pt.y + baseY }))
          : op.points;
        if (state.pixelMode) {
          strokePolyPixel(points, op.color || state.textColor || "#d8f3ff");
        } else {
          ctx.strokeStyle = op.color || state.textColor || "#d8f3ff";
          ctx.lineWidth = 1;
          ctx.beginPath();
          points.forEach((pt, index) => {
            if (index === 0) {
              ctx.moveTo(pt.x + 0.5, pt.y + 0.5);
            } else {
              ctx.lineTo(pt.x + 0.5, pt.y + 0.5);
            }
          });
          ctx.closePath();
          ctx.stroke();
        }
      } else if (op.type === "fillPoly") {
        const points = window
          ? op.points.map((pt) => ({ x: pt.x + baseX, y: pt.y + baseY }))
          : op.points;
        if (state.pixelMode) {
          fillPolyPixel(points, op.color || state.textColor || "#d8f3ff");
        } else {
          ctx.fillStyle = op.color || state.textColor || "#d8f3ff";
          ctx.beginPath();
          points.forEach((pt, index) => {
            if (index === 0) {
              ctx.moveTo(pt.x, pt.y);
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          });
          ctx.closePath();
          ctx.fill();
        }
      } else if (op.type === "screenDraw") {
        // tilemap draw support
      } else if (op.type === "tilemap") {
        const map = state.tilemaps.get(op.mapId);
        const tileBank = state.spriteBanks.get(op.bankId);
        if (map && tileBank && tileBank.img && tileBank.loaded) {
          const frameW = tileBank.frameW;
          const frameH = tileBank.frameH;
          const framesPerRow = Math.max(1, tileBank.framesPerRow);
          const scale = Number(op.scale) || 1;
          const dstW = frameW * scale;
          const dstH = frameH * scale;
          const startX = op.x + baseX;
          const startY = op.y + baseY;
          for (let ry = 0; ry < map.rows; ry += 1) {
            for (let cx = 0; cx < map.cols; cx += 1) {
              const tileIndex = Number(map.data[ry * map.cols + cx]) || 0;
              const sx = (tileIndex % framesPerRow) * frameW;
              const sy = Math.floor(tileIndex / framesPerRow) * frameH;
              const dx = startX + cx * dstW;
              const dy = startY + ry * dstH;
              ctx.drawImage(tileBank.img, sx, sy, frameW, frameH, dx, dy, dstW, dstH);
            }
          }
        }
        const bank = state.banks.get(op.bankId);
        if (bank) {
          const imageData = ctx.createImageData(canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < Math.min(data.length, bank.length); i += 1) {
            data[i] = bank[i];
          }
          ctx.putImageData(imageData, 0, 0);
        }
      } else if (op.type === "screenDrawRect") {
        const bank = state.banks.get(op.bankId);
        if (bank) {
          const srcW = 320;
          const srcH = 200;
          const dstX = op.x + baseX;
          const dstY = op.y + baseY;
          const dstW = op.w;
          const dstH = op.h;
          
          const imageData = ctx.createImageData(srcW, srcH);
          const data = imageData.data;
          for (let i = 0; i < Math.min(data.length, bank.length); i += 1) {
            data[i] = bank[i];
          }
          
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = srcW;
          tempCanvas.height = srcH;
          const tempCtx = tempCanvas.getContext("2d");
          tempCtx.putImageData(imageData, 0, 0);
          
          ctx.save();
          ctx.translate(dstX + dstW / 2, dstY + dstH / 2);
          if (op.flipH) ctx.scale(-1, 1);
          if (op.flipV) ctx.scale(1, -1);
          ctx.drawImage(tempCanvas, -dstW / 2, -dstH / 2, dstW, dstH);
          ctx.restore();
        }
      } else if (op.type === "sprite") {
        const sprite = state.sprites.get(op.name);
        if (!sprite) {
          endWindowClip(windowClip);
          continue;
        }
        const drawX = op.x + baseX;
        const drawY = op.y + baseY;
        const scaleX = Number(sprite.scaleX ?? 1) || 1;
        const scaleY = Number(sprite.scaleY ?? 1) || 1;
        const flipX = sprite.flipX ? -1 : 1;
        const flipY = sprite.flipY ? -1 : 1;
        const rotation = Number(sprite.rotation ?? 0) || 0;
        const hotX = Number(sprite.hotX ?? 0) || 0;
        const hotY = Number(sprite.hotY ?? 0) || 0;
        if (sprite.type === "rect") {
          const w = Number(sprite.w ?? 0);
          const h = Number(sprite.h ?? 0);
          if (w <= 0 || h <= 0) {
            endWindowClip(windowClip);
            continue;
          }
          ctx.save();
          ctx.translate(drawX - hotX + w / 2, drawY - hotY + h / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.scale(scaleX * flipX, scaleY * flipY);
          ctx.fillStyle = sprite.color;
          ctx.fillRect(-w / 2, -h / 2, w, h);
          ctx.restore();
        } else if (sprite.type === "image") {
          const w = Number(sprite.w ?? sprite.img?.naturalWidth ?? sprite.img?.width ?? 0);
          const h = Number(sprite.h ?? sprite.img?.naturalHeight ?? sprite.img?.height ?? 0);
          if (!w || !h) {
            endWindowClip(windowClip);
            continue;
          }
          ctx.save();
          ctx.translate(drawX - hotX + w / 2, drawY - hotY + h / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.scale(scaleX * flipX, scaleY * flipY);
          ctx.drawImage(sprite.img, -w / 2, -h / 2, w, h);
          ctx.restore();
        } else if (sprite.type === "bank") {
          const bank = state.spriteBanks.get(sprite.bankId);
          if (!bank || !bank.img || !bank.loaded) {
            endWindowClip(windowClip);
            continue;
          }
          const framesPerRow = Math.max(1, bank.framesPerRow);
          const frameIndex = Math.max(0, Math.floor(sprite.frame ?? 0));
          const sx = (frameIndex % framesPerRow) * bank.frameW;
          const sy = Math.floor(frameIndex / framesPerRow) * bank.frameH;
          const w = bank.frameW;
          const h = bank.frameH;
          ctx.save();
          ctx.translate(drawX - hotX + w / 2, drawY - hotY + h / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.scale(scaleX * flipX, scaleY * flipY);
          ctx.drawImage(bank.img, sx, sy, w, h, -w / 2, -h / 2, w, h);
          ctx.restore();
        }
      }
      endWindowClip(windowClip);
    }

    if (state.inputActive) {
      const prompt = state.inputPrompt || "";
      const buffer = state.inputBuffer || "";
      const cursor = Math.min(Math.max(0, state.inputCursor), buffer.length);
      const before = buffer.slice(0, cursor);
      const after = buffer.slice(cursor);
      const caret = state.inputCursorChar || "|";
      const lineText = prompt ? `${prompt} ${before}${caret}${after}` : `${before}${caret}${after}`;
      const inputWindow = state.currentWindowId === null || state.currentWindowId === undefined
        ? null
        : (state.windows.get(state.currentWindowId) || null);
      const baseX = inputWindow ? inputWindow.x : 0;
      const baseY = inputWindow ? inputWindow.y : 0;
      const inputKey = getLineKey(state.currentWindowId);
      const inputIndex = lineIndexMap.get(inputKey) ?? 0;
      const scaleX = Number.isFinite(state.textScaleX) && state.textScaleX > 0 ? state.textScaleX : 1;
      const scaleY = Number.isFinite(state.textScaleY) && state.textScaleY > 0 ? state.textScaleY : 1;
      const lineHeightForInput = FONT_H * scaleY;
      const maxLinesForInput = inputWindow
        ? Math.floor(inputWindow.h / lineHeightForInput)
        : Math.floor(canvas.height / lineHeightForInput);
      const inputLine = Math.min(inputIndex, Math.max(0, maxLinesForInput - 1));
      const inputClip = beginWindowClip(inputWindow);
      const effectiveFontW = FONT_W * scaleX;
      const rawCharsPerLine = inputWindow
        ? Math.floor(inputWindow.w / effectiveFontW)
        : Math.floor(canvas.width / effectiveFontW);
      const charsPerLine = Math.max(1, rawCharsPerLine);
      const lines = [];
      let currentLine = "";
      for (let i = 0; i < lineText.length; i += 1) {
        if (currentLine.length >= charsPerLine) {
          lines.push(currentLine);
          currentLine = "";
        }
        currentLine += lineText[i];
      }
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      for (let i = 0; i < lines.length; i += 1) {
        const lineRow = inputLine + i;
        if (lineRow >= maxLinesForInput) {
          break;
        }
        const y = baseY + lineRow * lineHeightForInput;
        drawBitmapText(lines[i], baseX, y, state.textColor || "#d8f3ff", null, scaleX, scaleY);
      }
      endWindowClip(inputClip);
    }
  }

  function drawBitmapText(text, x, y, color, outlineColor, scaleX = 1, scaleY = 1) {
    const sx = Number.isFinite(scaleX) && scaleX > 0 ? scaleX : 1;
    const sy = Number.isFinite(scaleY) && scaleY > 0 ? scaleY : 1;
    const baseX = Math.round(x);
    const baseY = Math.round(y);
    if (sx === 1 && sy === 1) {
      for (let i = 0; i < text.length; i += 1) {
        drawChar(text[i], baseX + i * FONT_W, baseY, color, outlineColor);
      }
      return;
    }
    if (sx === 0.5 && Number.isInteger(sy)) {
      const advance = 4;
      for (let i = 0; i < text.length; i += 1) {
        drawCharHalfWidthScaled(text[i], baseX + i * advance, baseY, color, outlineColor, sy);
      }
      return;
    }
    if (Number.isInteger(sx) && Number.isInteger(sy)) {
      for (let i = 0; i < text.length; i += 1) {
        drawCharScaled(text[i], baseX + i * FONT_W * sx, baseY, color, outlineColor, sx, sy);
      }
      return;
    }
    for (let i = 0; i < text.length; i += 1) {
      drawCharScaledNearest(text[i], baseX + i * FONT_W * sx, baseY, color, outlineColor, sx, sy);
    }
  }

  function drawChar(ch, x, y, color, outlineColor) {
    const code = ch.charCodeAt(0);
    const index = (code >= 0 && code < 128) ? code : 63;
    const fontData = state.banks.get(state.fontBank) || DEFAULT_FONT_DATA;
    const base = index * 8;
    
    // Draw outline first if specified
    if (outlineColor) {
      ctx.fillStyle = outlineColor;
      for (let row = 0; row < FONT_H; row += 1) {
        const bits = fontData[base + row] || 0;
        for (let col = 0; col < FONT_W; col += 1) {
          if (bits & (1 << (7 - col))) {
            // Draw outline pixels around each font pixel
            for (let dx = -1; dx <= 1; dx += 1) {
              for (let dy = -1; dy <= 1; dy += 1) {
                if (dx !== 0 || dy !== 0) {
                  ctx.fillRect(x + col + dx, y + row + dy, 1, 1);
                }
              }
            }
          }
        }
      }
    }
    
    // Draw main character
    ctx.fillStyle = color;
    for (let row = 0; row < FONT_H; row += 1) {
      const bits = fontData[base + row] || 0;
      for (let col = 0; col < FONT_W; col += 1) {
        if (bits & (1 << (7 - col))) {
          ctx.fillRect(x + col, y + row, 1, 1);
        }
      }
    }
  }

  function drawCharHalfWidth(ch, x, y, color, outlineColor) {
    const code = ch.charCodeAt(0);
    const index = (code >= 0 && code < 128) ? code : 63;
    const fontData = state.banks.get(state.fontBank) || DEFAULT_FONT_DATA;
    const base = index * 8;

    const drawPixel = (px, py) => {
      ctx.fillRect(px, py, 1, 1);
    };

    if (outlineColor) {
      ctx.fillStyle = outlineColor;
      for (let row = 0; row < FONT_H; row += 1) {
        const bits = fontData[base + row] || 0;
        for (let col = 0; col < 4; col += 1) {
          const leftBit = 1 << (7 - (col * 2));
          const rightBit = 1 << (7 - (col * 2 + 1));
          if (bits & (leftBit | rightBit)) {
            for (let dx = -1; dx <= 1; dx += 1) {
              for (let dy = -1; dy <= 1; dy += 1) {
                if (dx !== 0 || dy !== 0) {
                  drawPixel(x + col + dx, y + row + dy);
                }
              }
            }
          }
        }
      }
    }

    ctx.fillStyle = color;
    for (let row = 0; row < FONT_H; row += 1) {
      const bits = fontData[base + row] || 0;
      for (let col = 0; col < 4; col += 1) {
        const leftBit = 1 << (7 - (col * 2));
        const rightBit = 1 << (7 - (col * 2 + 1));
        if (bits & (leftBit | rightBit)) {
          drawPixel(x + col, y + row);
        }
      }
    }
  }

  function drawCharHalfWidthScaled(ch, x, y, color, outlineColor, scaleY) {
    const baseX = Math.round(x);
    const baseY = Math.round(y);
    const code = ch.charCodeAt(0);
    const index = (code >= 0 && code < 128) ? code : 63;
    const fontData = state.banks.get(state.fontBank) || DEFAULT_FONT_DATA;
    const base = index * 8;
    const sy = Number.isFinite(scaleY) && scaleY > 0 ? Math.floor(scaleY) : 1;

    const drawPixel = (px, py) => {
      ctx.fillRect(baseX + px, baseY + py, 1, sy);
    };

    if (outlineColor) {
      ctx.fillStyle = outlineColor;
      for (let row = 0; row < FONT_H; row += 1) {
        const bits = fontData[base + row] || 0;
        for (let col = 0; col < 4; col += 1) {
          const leftBit = 1 << (7 - (col * 2));
          const rightBit = 1 << (7 - (col * 2 + 1));
          if (bits & (leftBit | rightBit)) {
            for (let dx = -1; dx <= 1; dx += 1) {
              for (let dy = -1; dy <= 1; dy += 1) {
                if (dx !== 0 || dy !== 0) {
                  drawPixel(col + dx, row * sy + dy);
                }
              }
            }
          }
        }
      }
    }

    ctx.fillStyle = color;
    for (let row = 0; row < FONT_H; row += 1) {
      const bits = fontData[base + row] || 0;
      for (let col = 0; col < 4; col += 1) {
        const leftBit = 1 << (7 - (col * 2));
        const rightBit = 1 << (7 - (col * 2 + 1));
        if (bits & (leftBit | rightBit)) {
          drawPixel(col, row * sy);
        }
      }
    }
  }

  function drawCharScaled(ch, x, y, color, outlineColor, scaleX, scaleY) {
    const baseX = Math.round(x);
    const baseY = Math.round(y);
    const code = ch.charCodeAt(0);
    const index = (code >= 0 && code < 128) ? code : 63;
    const fontData = state.banks.get(state.fontBank) || DEFAULT_FONT_DATA;
    const base = index * 8;
    const sx = Math.floor(scaleX);
    const sy = Math.floor(scaleY);

    const drawPixel = (px, py) => {
      ctx.fillRect(baseX + px, baseY + py, sx, sy);
    };

    if (outlineColor) {
      ctx.fillStyle = outlineColor;
      for (let row = 0; row < FONT_H; row += 1) {
        const bits = fontData[base + row] || 0;
        for (let col = 0; col < FONT_W; col += 1) {
          if (bits & (1 << (7 - col))) {
            for (let dx = -1; dx <= 1; dx += 1) {
              for (let dy = -1; dy <= 1; dy += 1) {
                if (dx !== 0 || dy !== 0) {
                  drawPixel(col * sx + dx, row * sy + dy);
                }
              }
            }
          }
        }
      }
    }

    ctx.fillStyle = color;
    for (let row = 0; row < FONT_H; row += 1) {
      const bits = fontData[base + row] || 0;
      for (let col = 0; col < FONT_W; col += 1) {
        if (bits & (1 << (7 - col))) {
          drawPixel(col * sx, row * sy);
        }
      }
    }
  }

  function drawCharScaledNearest(ch, x, y, color, outlineColor, scaleX, scaleY) {
    const baseX = Math.round(x);
    const baseY = Math.round(y);
    const code = ch.charCodeAt(0);
    const index = (code >= 0 && code < 128) ? code : 63;
    const fontData = state.banks.get(state.fontBank) || DEFAULT_FONT_DATA;
    const base = index * 8;
    const sx = Number.isFinite(scaleX) && scaleX > 0 ? scaleX : 1;
    const sy = Number.isFinite(scaleY) && scaleY > 0 ? scaleY : 1;

    const colSpans = Array.from({ length: FONT_W }, (_, col) => {
      const x0 = Math.floor(col * sx);
      const x1 = Math.floor((col + 1) * sx);
      return { x: x0, w: Math.max(0, x1 - x0) };
    });
    const rowSpans = Array.from({ length: FONT_H }, (_, row) => {
      const y0 = Math.floor(row * sy);
      const y1 = Math.floor((row + 1) * sy);
      return { y: y0, h: Math.max(0, y1 - y0) };
    });

    const drawPixel = (px, py, w, h) => {
      if (w <= 0 || h <= 0) {
        return;
      }
      ctx.fillRect(baseX + px, baseY + py, w, h);
    };

    if (outlineColor) {
      ctx.fillStyle = outlineColor;
      for (let row = 0; row < FONT_H; row += 1) {
        const bits = fontData[base + row] || 0;
        const rowSpan = rowSpans[row];
        for (let col = 0; col < FONT_W; col += 1) {
          if (bits & (1 << (7 - col))) {
            const colSpan = colSpans[col];
            if (colSpan.w <= 0 || rowSpan.h <= 0) {
              continue;
            }
            for (let dx = -1; dx <= 1; dx += 1) {
              for (let dy = -1; dy <= 1; dy += 1) {
                if (dx !== 0 || dy !== 0) {
                  drawPixel(colSpan.x + dx, rowSpan.y + dy, colSpan.w, rowSpan.h);
                }
              }
            }
          }
        }
      }
    }

    ctx.fillStyle = color;
    for (let row = 0; row < FONT_H; row += 1) {
      const bits = fontData[base + row] || 0;
      const rowSpan = rowSpans[row];
      for (let col = 0; col < FONT_W; col += 1) {
        if (bits & (1 << (7 - col))) {
          const colSpan = colSpans[col];
          drawPixel(colSpan.x, rowSpan.y, colSpan.w, rowSpan.h);
        }
      }
    }
  }

  function drawPixel(x, y, color) {
    const px = Math.round(x);
    const py = Math.round(y);
    ctx.fillStyle = color;
    ctx.fillRect(px, py, 1, 1);
  }

  function drawLinePixel(x1, y1, x2, y2, color) {
    let x0 = Math.round(x1);
    let y0 = Math.round(y1);
    const x1i = Math.round(x2);
    const y1i = Math.round(y2);
    const dx = Math.abs(x1i - x0);
    const dy = Math.abs(y1i - y0);
    const sx = x0 < x1i ? 1 : -1;
    const sy = y0 < y1i ? 1 : -1;
    let err = dx - dy;
    while (true) {
      drawPixel(x0, y0, color);
      if (x0 === x1i && y0 === y1i) {
        break;
      }
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  function strokeRectPixel(x, y, w, h, color) {
    const x0 = Math.round(x);
    const y0 = Math.round(y);
    const x1 = Math.round(x + w);
    const y1 = Math.round(y + h);
    drawLinePixel(x0, y0, x1, y0, color);
    drawLinePixel(x1, y0, x1, y1, color);
    drawLinePixel(x1, y1, x0, y1, color);
    drawLinePixel(x0, y1, x0, y0, color);
  }

  function fillRectPixel(x, y, w, h, color) {
    const x0 = Math.round(x);
    const y0 = Math.round(y);
    const ww = Math.round(w);
    const hh = Math.round(h);
    ctx.fillStyle = color;
    ctx.fillRect(x0, y0, ww, hh);
  }

  function strokeEllipsePixel(cx, cy, rx, ry, color) {
    const rxi = Math.max(1, Math.round(Math.abs(rx)));
    const ryi = Math.max(1, Math.round(Math.abs(ry)));
    for (let y = -ryi; y <= ryi; y += 1) {
      const t = 1 - (y * y) / (ryi * ryi);
      if (t < 0) continue;
      const x = Math.round(rxi * Math.sqrt(t));
      drawPixel(cx - x, cy + y, color);
      drawPixel(cx + x, cy + y, color);
    }
  }

  function fillEllipsePixel(cx, cy, rx, ry, color) {
    const rxi = Math.max(1, Math.round(Math.abs(rx)));
    const ryi = Math.max(1, Math.round(Math.abs(ry)));
    ctx.fillStyle = color;
    for (let y = -ryi; y <= ryi; y += 1) {
      const t = 1 - (y * y) / (ryi * ryi);
      if (t < 0) continue;
      const x = Math.round(rxi * Math.sqrt(t));
      ctx.fillRect(Math.round(cx - x), Math.round(cy + y), x * 2 + 1, 1);
    }
  }

  function strokeArcPixel(cx, cy, r, start, end, color) {
    const step = Math.max(0.05, Math.PI / 90);
    let prevX = null;
    let prevY = null;
    for (let a = start; a <= end; a += step) {
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (prevX !== null) {
        drawLinePixel(prevX, prevY, x, y, color);
      }
      prevX = x;
      prevY = y;
    }
  }

  function fillArcPixel(cx, cy, r, start, end, color) {
    const points = [{ x: cx, y: cy }];
    const step = Math.max(0.05, Math.PI / 90);
    for (let a = start; a <= end; a += step) {
      points.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    }
    fillPolyPixel(points, color);
  }

  function strokePolyPixel(points, color) {
    if (!points.length) return;
    for (let i = 0; i < points.length; i += 1) {
      const a = points[i];
      const b = points[(i + 1) % points.length];
      drawLinePixel(a.x, a.y, b.x, b.y, color);
    }
  }

  function fillPolyPixel(points, color) {
    if (points.length < 3) return;
    let minY = Infinity;
    let maxY = -Infinity;
    points.forEach((p) => {
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    });
    minY = Math.round(minY);
    maxY = Math.round(maxY);
    ctx.fillStyle = color;
    for (let y = minY; y <= maxY; y += 1) {
      const nodes = [];
      for (let i = 0; i < points.length; i += 1) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        if ((p1.y < y && p2.y >= y) || (p2.y < y && p1.y >= y)) {
          const x = p1.x + ((y - p1.y) / (p2.y - p1.y)) * (p2.x - p1.x);
          nodes.push(x);
        }
      }
      nodes.sort((a, b) => a - b);
      for (let i = 0; i + 1 < nodes.length; i += 2) {
        const xStart = Math.round(nodes[i]);
        const xEnd = Math.round(nodes[i + 1]);
        ctx.fillRect(xStart, y, xEnd - xStart + 1, 1);
      }
    }
  }


  function stripCommentsFromSource(source) {
    let out = "";
    let inString = false;
    let inBlock = false;
    for (let i = 0; i < source.length; i += 1) {
      const ch = source[i];
      const next = source[i + 1];
      if (inBlock) {
        if (ch === "*" && next === "/") {
          inBlock = false;
          i += 1;
        } else if (ch === "\n") {
          out += "\n";
        }
        continue;
      }
      if (inString) {
        out += ch;
        if (ch === "\"" && source[i - 1] !== "\\") {
          inString = false;
        }
        continue;
      }
      if (ch === "\"") {
        inString = true;
        out += ch;
        continue;
      }
      if (ch === "/" && next === "*") {
        inBlock = true;
        i += 1;
        continue;
      }
      if (ch === "/" && next === "/") {
        while (i < source.length && source[i] !== "\n") {
          i += 1;
        }
        if (i < source.length && source[i] === "\n") {
          out += "\n";
        }
        continue;
      }
      out += ch;
    }
    return out;
  }

  function splitStatements(line) {
    const parts = [];
    let current = "";
    let inString = false;
    const trimmedLine = line.trim().toUpperCase();
    const isREM = trimmedLine.startsWith("REM") || trimmedLine.startsWith("//");
    
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === "\"") {
        inString = !inString;
        current += ch;
        continue;
      }
      if (!inString && ch === ":" && !isREM) {
        parts.push(current);
        current = "";
        continue;
      }
      current += ch;
    }
    parts.push(current);
    return parts;
  }

  function parseProgram(source) {
    const cleaned = stripCommentsFromSource(source);
    const rawLines = cleaned.split(/\r?\n/);
    const lines = [];
    for (let i = 0; i < rawLines.length; i += 1) {
      const raw = rawLines[i];
      const parts = splitStatements(raw);
      for (const part of parts) {
        const trimmed = part.trimEnd();
        if (trimmed.trim().length > 0) {
          lines.push({ text: trimmed, line: i + 1 });
        }
      }
    }

    const functions = new Map();
    const dataList = [];
    const dataIdMap = new Map();

    function isTerminator(upperLine, terminators) {
      if (terminators.has(upperLine)) {
        return true;
      }
      if (terminators.has("ELSEIF") && upperLine.startsWith("ELSEIF ")) {
        return true;
      }
      if (terminators.has("ELSE") && upperLine === "ELSE") {
        return true;
      }
      if (terminators.has("ENDIF") && upperLine === "ENDIF") {
        return true;
      }
      if (terminators.has("NEXT") && (upperLine === "NEXT" || upperLine.startsWith("NEXT "))) {
        return true;
      }
      return false;
    }

    function parseStatements(startIndex, terminators) {
      const statements = [];
      let i = startIndex;
      while (i < lines.length) {
        const raw = lines[i];
        const line = raw.text.trim();
        const upper = line.toUpperCase();
        const lineNumber = raw.line;

        if (isTerminator(upper, terminators)) {
          let term = upper;
          if (upper.startsWith("ELSEIF ")) {
            term = "ELSEIF";
          }
          return { statements, index: i, terminator: term };
        }

        if (upper.startsWith("REM") || line.startsWith("//")) {
          i += 1;
          continue;
        }

        if (upper.startsWith("FUNC ")) {
          const match = line.match(/^FUNC\s+([A-Za-z_][A-Za-z0-9_]*)\s*\((.*)\)\s*$/i);
          if (!match) {
            throw new Error(`Invalid FUNC at line ${lineNumber}: ${line}`);
          }
          const name = match[1];
          if (functions.has(name)) {
            throw new Error(`Duplicate function name at line ${lineNumber}: ${name}`);
          }
          if (builtins && Object.prototype.hasOwnProperty.call(builtins, name)) {
            throw new Error(`Function name conflicts with builtin at line ${lineNumber}: ${name}`);
          }
          const params = parseArguments(match[2]);
          const bodyParsed = parseStatements(i + 1, new Set(["END"]));
          functions.set(name, { params, body: bodyParsed.statements });
          i = bodyParsed.index + 1;
          continue;
        }

        if (upper.startsWith("IF ")) {
          // Support single-line IF ... THEN <stmt> ENDIF
          const singleLineMatch = line.match(/^IF\s+(.+?)\s+THEN\s+(.+?)\s+ENDIF$/i);
          if (singleLineMatch) {
            const cond = singleLineMatch[1];
            const bodyText = singleLineMatch[2].trim();
            const bodyStmts = [];
            if (!/^REM\b/i.test(bodyText) && !bodyText.startsWith("//")) {
              const hasLetB = bodyText.toUpperCase().startsWith("LET ");
              const lineForAssignB = hasLetB ? bodyText.slice(4).trim() : bodyText;
              const arrayAssignMatchB = lineForAssignB.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\s*\((.+)\)\s*=\s*(.+)$/);
              if (arrayAssignMatchB) {
                bodyStmts.push({ type: "arrayAssign", name: arrayAssignMatchB[1], indexExpr: arrayAssignMatchB[2], expr: arrayAssignMatchB[3], line: lineNumber });
              } else {
                const assignMatchB = lineForAssignB.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*(.+)$/);
                if (assignMatchB) {
                  const stmtTypeB = hasLetB ? "let" : "assign";
                  bodyStmts.push({ type: stmtTypeB, name: assignMatchB[1], expr: assignMatchB[2], line: lineNumber });
                } else {
                  bodyStmts.push({ type: "expr", expr: bodyText, line: lineNumber });
                }
              }
            }
            const branches = [];
            branches.push({ condition: cond, body: bodyStmts, line: lineNumber });
            statements.push({ type: "if", branches, elseBody: null, line: lineNumber });
            i += 1;
            continue;
          }

          // Support single-line IF ... THEN <stmt> (no ENDIF required)
          const singleLineNoEndMatch = line.match(/^IF\s+(.+?)\s+THEN\s+(.+)$/i);
          if (singleLineNoEndMatch) {
            const cond = singleLineNoEndMatch[1];
            const bodyText = singleLineNoEndMatch[2].trim();
            const bodyStmts = [];
            if (!/^REM\b/i.test(bodyText) && !bodyText.startsWith("//")) {
              const hasLetB = bodyText.toUpperCase().startsWith("LET ");
              const lineForAssignB = hasLetB ? bodyText.slice(4).trim() : bodyText;
              const arrayAssignMatchB = lineForAssignB.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\s*\((.+)\)\s*=\s*(.+)$/);
              if (arrayAssignMatchB) {
                bodyStmts.push({ type: "arrayAssign", name: arrayAssignMatchB[1], indexExpr: arrayAssignMatchB[2], expr: arrayAssignMatchB[3], line: lineNumber });
              } else {
                const assignMatchB = lineForAssignB.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*(.+)$/);
                if (assignMatchB) {
                  const stmtTypeB = hasLetB ? "let" : "assign";
                  bodyStmts.push({ type: stmtTypeB, name: assignMatchB[1], expr: assignMatchB[2], line: lineNumber });
                } else {
                  bodyStmts.push({ type: "expr", expr: bodyText, line: lineNumber });
                }
              }
            }
            const branchesNoEnd = [];
            branchesNoEnd.push({ condition: cond, body: bodyStmts, line: lineNumber });
            statements.push({ type: "if", branches: branchesNoEnd, elseBody: null, line: lineNumber });
            i += 1;
            continue;
          }

          const ifMatch = line.match(/^IF\s+(.+)\s+THEN$/i);
          if (!ifMatch) {
            throw new Error(`Invalid IF at line ${lineNumber}: ${line}`);
          }
          const branches = [];
          const firstCond = ifMatch[1];
          const firstBody = parseStatements(i + 1, new Set(["ELSEIF", "ELSE", "ENDIF"]));
          branches.push({ condition: firstCond, body: firstBody.statements, line: lineNumber });
          let idx = firstBody.index;
          let elseBody = null;
          let term = firstBody.terminator;

          if (term === "ENDIF" || term === null) {
            statements.push({ type: "if", branches, elseBody, line: lineNumber });
            i = idx + 1;
            continue;
          }

          while (idx < lines.length) {
            if (term === "ELSEIF") {
              const nextRaw = lines[idx];
              const nextLine = nextRaw.text.trim();
              const nextUpper = nextLine.toUpperCase();
              const nextLineNumber = nextRaw.line;
              if (!nextUpper.startsWith("ELSEIF ")) {
                throw new Error(`Unexpected token in IF block at line ${nextLineNumber}: ${nextLine}`);
              }
              const elseifMatch = nextLine.match(/^ELSEIF\s+(.+)\s+THEN$/i);
              if (!elseifMatch) {
                throw new Error(`Invalid ELSEIF at line ${nextLineNumber}: ${nextLine}`);
              }
              const elseifBody = parseStatements(idx + 1, new Set(["ELSEIF", "ELSE", "ENDIF"]));
              branches.push({ condition: elseifMatch[1], body: elseifBody.statements, line: nextLineNumber });
              idx = elseifBody.index;
              term = elseifBody.terminator;
              if (term === "ENDIF" || term === null) {
                idx += 1;
                break;
              }
              continue;
            }

            if (term === "ELSE") {
              const elseParsed = parseStatements(idx + 1, new Set(["ENDIF"]));
              elseBody = elseParsed.statements;
              idx = elseParsed.index + 1;
              break;
            }

            if (term === "ENDIF") {
              idx += 1;
              break;
            }

            const nextRaw = lines[idx];
            const nextLine = nextRaw.text.trim();
            const nextLineNumber = nextRaw.line;
            throw new Error(`Unexpected token in IF block at line ${nextLineNumber}: ${nextLine}`);
          }

          statements.push({ type: "if", branches, elseBody, line: lineNumber });
          i = idx;
          continue;
        }

        if (upper.startsWith("WHILE ")) {
          const match = line.match(/^WHILE\s+(.+)$/i);
          if (!match) {
            throw new Error(`Invalid WHILE at line ${lineNumber}: ${line}`);
          }
          const condition = match[1];
          const bodyParsed = parseStatements(i + 1, new Set(["ENDWHILE"]));
          statements.push({ type: "while", condition, body: bodyParsed.statements, line: lineNumber });
          i = bodyParsed.index + 1;
          continue;
        }

        if (upper.startsWith("FOR ")) {
          const match = line.match(/^FOR\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)\s+TO\s+(.+?)(?:\s+STEP\s+(.+))?$/i);
          if (!match) {
            throw new Error(`Invalid FOR at line ${lineNumber}: ${line}`);
          }
          const varName = match[1];
          const startExpr = match[2];
          const endExpr = match[3];
          const stepExpr = match[4] ?? "1";
          const bodyParsed = parseStatements(i + 1, new Set(["NEXT"]));
          const terminatorLine = lines[bodyParsed.index];
          const termText = terminatorLine ? terminatorLine.text.trim() : "";
          const nextMatch = termText.match(/^NEXT\s*([A-Za-z_][A-Za-z0-9_]*)?\s*$/i);
          if (!nextMatch) {
            throw new Error(`Invalid NEXT at line ${terminatorLine?.line ?? lineNumber}: ${termText}`);
          }
          const nextVar = nextMatch[1];
          if (nextVar && nextVar.toUpperCase() !== varName.toUpperCase()) {
            throw new Error(`NEXT variable mismatch at line ${terminatorLine.line}: ${nextVar}`);
          }
          statements.push({ type: "for", varName, startExpr, endExpr, stepExpr, body: bodyParsed.statements, line: lineNumber });
          i = bodyParsed.index + 1;
          continue;
        }

        if (upper.startsWith("DIM ") || upper === "DIM") {
          const argText = line.slice(3).trim();
          const items = argText.length ? parseArguments(argText) : [];
          if (!items.length) {
            throw new Error(`DIM requires at least one array at line ${lineNumber}`);
          }
          const dims = [];
          for (const item of items) {
            const match = item.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*\((.+)\)\s*$/);
            if (!match) {
              throw new Error(`Invalid DIM at line ${lineNumber}: ${item}`);
            }
            dims.push({ name: match[1], sizeExpr: match[2] });
          }
          statements.push({ type: "dim", dims, line: lineNumber });
          i += 1;
          continue;
        }

        if (upper.startsWith("DATA ") || upper === "DATA") {
          const argText = line.slice(4).trim();
          const items = argText.length ? parseArguments(argText) : [];
          if (!items.length) {
            throw new Error(`DATA requires an id at line ${lineNumber}`);
          }
          const idRaw = items.shift();
          const id = idRaw.startsWith("\"") && idRaw.endsWith("\"") ? idRaw.slice(1, -1) : idRaw;
          if (!dataIdMap.has(id)) {
            dataIdMap.set(id, dataList.length);
          }
          for (const item of items) {
            if (item.startsWith("\"") && item.endsWith("\"")) {
              dataList.push({ type: "string", value: item.slice(1, -1) });
            } else if (item.length === 0) {
              dataList.push({ type: "string", value: "" });
            } else if (!Number.isNaN(Number(item))) {
              dataList.push({ type: "number", value: Number(item) });
            } else {
              dataList.push({ type: "string", value: item });
            }
          }
          statements.push({ type: "data", line: lineNumber });
          i += 1;
          continue;
        }

        if (upper.startsWith("RESTORE")) {
          const target = line.slice(7).trim();
          const id = target.length ? target : null;
          statements.push({ type: "restore", id, line: lineNumber });
          i += 1;
          continue;
        }

        if (upper.startsWith("READ ")) {
          const argText = line.slice(4).trim();
          const names = parseArguments(argText);
          if (!names.length) {
            throw new Error(`Invalid READ at line ${lineNumber}: ${line}`);
          }
          statements.push({ type: "read", names, line: lineNumber });
          i += 1;
          continue;
        }

        if (upper.startsWith("SEED")) {
          let argText = line.slice(4).trim();
          if (argText.startsWith("(") && argText.endsWith(")")) {
            argText = argText.slice(1, -1).trim();
          }
          const expr = argText.length ? argText : null;
          statements.push({ type: "seed", expr, line: lineNumber });
          i += 1;
          continue;
        }

        if (upper === "END") {
          statements.push({ type: "end", line: lineNumber });
          i += 1;
          continue;
        }

        if (upper.startsWith("RETURN")) {
          const expr = line.slice(6).trim();
          statements.push({ type: "return", expr: expr.length ? expr : null, line: lineNumber });
          i += 1;
          continue;
        }

        const hasLet = upper.startsWith("LET ");
        const lineForAssign = hasLet ? line.slice(4).trim() : line;
        const arrayAssignMatch = lineForAssign.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\s*\((.+)\)\s*=\s*(.+)$/);
        if (arrayAssignMatch) {
          statements.push({
            type: "arrayAssign",
            name: arrayAssignMatch[1],
            indexExpr: arrayAssignMatch[2],
            expr: arrayAssignMatch[3],
            line: lineNumber
          });
          i += 1;
          continue;
        }
        const assignMatch = lineForAssign.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*(.+)$/);
        if (assignMatch) {
          const stmtType = hasLet ? "let" : "assign";
          statements.push({ type: stmtType, name: assignMatch[1], expr: assignMatch[2], line: lineNumber });
          i += 1;
          continue;
        }

        statements.push({ type: "expr", expr: line, line: lineNumber });
        i += 1;
      }

      return { statements, index: i, terminator: null };
    }

    const parsed = parseStatements(0, new Set());
    return { statements: parsed.statements, functions, dataList, dataIdMap };
  }

  function normalizeOperators(expr) {
    // Replace textual operators first
    let out = expr
      .replace(/<>/g, "!=")
      .replace(/\bAND\b/g, "&&")
      .replace(/\bOR\b/g, "||")
      .replace(/\bNOT\b/g, "!");

    // Replace single '&' (string concat in GameBASIC) with '+' for JS
    // but leave '&&' intact and do not touch '&' inside string literals
    let res = "";
    let inString = false;
    for (let i = 0; i < out.length; i += 1) {
      const ch = out[i];
      if (ch === '"') {
        inString = !inString;
        res += ch;
        continue;
      }
      if (!inString && ch === '&') {
        // preserve logical AND '&&'
        if (out[i + 1] === '&') {
          res += '&&';
          i += 1;
        } else {
          res += '+';
        }
        continue;
      }
      res += ch;
    }
    return res;
  }

  function transformArrayAccess(expr) {
    let out = "";
    let inString = false;
    let i = 0;
    while (i < expr.length) {
      const ch = expr[i];
      if (ch === "\"") {
        inString = !inString;
        out += ch;
        i += 1;
        continue;
      }
      if (!inString && /[A-Za-z_]/.test(ch)) {
        let j = i + 1;
        while (j < expr.length && /[A-Za-z0-9_]/.test(expr[j])) {
          j += 1;
        }
        const name = expr.slice(i, j);
        let k = j;
        while (k < expr.length && /\s/.test(expr[k])) {
          k += 1;
        }
        // Transform to array access if followed by ( and not a builtin or user function
        if (expr[k] === "(" && !Object.prototype.hasOwnProperty.call(builtins, name) && !state.functions.has(name)) {
          out += `__ARR__("${name}",`;
          i = k + 1;
          continue;
        }
        out += name;
        i = j;
        continue;
      }
      out += ch;
      i += 1;
    }
    return out;
  }

  function evalExpression(expr, scope) {
    const normalized = transformArrayAccess(normalizeOperators(expr));
    try {
      const fn = new Function(
        "vars",
        "fns",
        `return (function(){with(vars){with(fns){return (${normalized});}}})();`
      );
      const proxy = buildFunctionProxy(scope);
      proxy.__ARR__ = (name, index) => {
        const arr = getArray(scope, String(name));
        if (!arr) {
          throw new Error(`Array not defined: ${name}`);
        }
        const idx = Math.floor(Number(index));
        if (!Number.isFinite(idx) || idx < 0 || idx >= arr.length) {
          return 0;
        }
        return arr[idx] ?? 0;
      };
      return fn(scope, proxy);
    } catch (error) {
      throw new Error(`Bad expression: ${expr}`);
    }
  }

  async function awaitValue(value) {
    if (value && typeof value.then === "function") {
      return await value;
    }
    return value;
  }

  function parseArguments(argText) {
    const args = [];
    let current = "";
    let inString = false;
    let depth = 0;
    for (let i = 0; i < argText.length; i += 1) {
      const ch = argText[i];
      if (ch === '"') {
        inString = !inString;
        current += ch;
        continue;
      }
      if (!inString && ch === "(") {
        depth += 1;
        current += ch;
        continue;
      }
      if (!inString && ch === ")") {
        depth -= 1;
        current += ch;
        continue;
      }
      if (ch === "," && !inString && depth === 0) {
        args.push(current.trim());
        current = "";
        continue;
      }
      current += ch;
    }
    if (current.trim().length > 0) {
      args.push(current.trim());
    }
    return args;
  }

  function buildFunctionProxy(scope) {
    const proxy = Object.create(null);
    for (const name of Object.keys(builtins)) {
      proxy[name] = (...args) => builtins[name](...args);
    }
    for (const name of state.functions.keys()) {
      proxy[name] = (...args) => callFunction(name, args, scope);
    }
    return proxy;
  }

  function setVar(scope, name, value) {
    let target = scope;
    while (target && !Object.prototype.hasOwnProperty.call(target, name)) {
      target = Object.getPrototypeOf(target);
    }
    (target || scope)[name] = value;
  }

  function getArray(scope, name) {
    const arrKey = "__ARR_" + name;
    let target = scope;
    while (target) {
      if (Object.prototype.hasOwnProperty.call(target, arrKey)) {
        return target[arrKey];
      }
      target = Object.getPrototypeOf(target);
    }
    return null;
  }

  async function callFunction(name, args, callingScope) {
    const func = state.functions.get(name);
    if (!func) {
      throw new Error(`Unknown function: ${name}`);
    }
    const localScope = Object.create(callingScope);
    func.params.forEach((param, index) => {
      if (param.length > 0) {
        localScope[param] = args[index];
      }
    });
    const result = await executeStatements(func.body, localScope);
    if (result && result.type === "return") {
      return result.value;
    }
    return null;
  }

  async function executeStatements(statements, scope) {
    for (let i = 0; i < statements.length && state.running; i += 1) {
      const stmt = statements[i];
      state.currentLine = stmt.line ?? null;
      switch (stmt.type) {
        case "data":
          break;
        case "restore":
          if (stmt.id === null) {
            state.dataIndex = 0;
          } else {
            if (!state.dataIdMap.has(stmt.id)) {
              throw new Error(`RESTORE id not found: ${stmt.id}`);
            }
            state.dataIndex = state.dataIdMap.get(stmt.id);
          }
          break;
        case "read":
          for (const name of stmt.names) {
            if (state.functions.has(name) || Object.prototype.hasOwnProperty.call(builtins, name)) {
              throw new Error(`Name conflict: ${name} is a function`);
            }
            if (state.dataIndex >= state.dataList.length) {
              throw new Error("READ past end of DATA");
            }
            const entry = state.dataList[state.dataIndex];
            state.dataIndex += 1;
            setVar(scope, name, entry.value);
          }
          break;
        case "seed": {
          const seedVal = stmt.expr ? await awaitValue(evalExpression(stmt.expr, scope)) : undefined;
          setRandomSeed(seedVal);
          break;
        }
        case "dim":
          for (const dim of stmt.dims) {
            if (state.functions.has(dim.name) || Object.prototype.hasOwnProperty.call(builtins, dim.name)) {
              throw new Error(`Name conflict: ${dim.name} is a function`);
            }
            const sizeVal = await awaitValue(evalExpression(dim.sizeExpr, scope));
            const sizeNum = Math.floor(Number(sizeVal));
            if (!Number.isFinite(sizeNum) || sizeNum < 0) {
              throw new Error(`Invalid DIM size for ${dim.name}`);
            }
            const len = sizeNum + 1;
            scope["__ARR_" + dim.name] = new Array(len).fill(0);
          }
          break;
        case "assign":
          if (state.functions.has(stmt.name) || Object.prototype.hasOwnProperty.call(builtins, stmt.name)) {
            throw new Error(`Name conflict: ${stmt.name} is a function`);
          }
          setVar(scope, stmt.name, await awaitValue(evalExpression(stmt.expr, scope)));
          break;
        case "let":
          if (state.functions.has(stmt.name) || Object.prototype.hasOwnProperty.call(builtins, stmt.name)) {
            throw new Error(`Name conflict: ${stmt.name} is a function`);
          }
          scope[stmt.name] = await awaitValue(evalExpression(stmt.expr, scope));
          break;
        case "arrayAssign": {
          const arr = getArray(scope, stmt.name);
          if (!arr) {
            throw new Error(`Array not defined: ${stmt.name}`);
          }
          const idxVal = await awaitValue(evalExpression(stmt.indexExpr, scope));
          const idx = Math.floor(Number(idxVal));
          if (!Number.isFinite(idx) || idx < 0 || idx >= arr.length) {
            throw new Error(`Array index out of range: ${stmt.name}(${idx})`);
          }
          const value = await awaitValue(evalExpression(stmt.expr, scope));
          arr[idx] = value;
          break;
        }
        case "expr":
          await awaitValue(evalExpression(stmt.expr, scope));
          break;
        case "if": {
          let handled = false;
          if (stmt.branches) {
            for (const branch of stmt.branches) {
              if (await awaitValue(evalExpression(branch.condition, scope))) {
                const res = await executeStatements(branch.body, scope);
                handled = true;
                if (res) {
                  return res;
                }
                break;
              }
            }
            if (!handled && stmt.elseBody) {
              const res = await executeStatements(stmt.elseBody, scope);
              if (res) {
                return res;
              }
            }
          } else {
            if (await awaitValue(evalExpression(stmt.condition, scope))) {
              const res = await executeStatements(stmt.body, scope);
              if (res) {
                return res;
              }
            }
          }
          break;
        }
        case "while":
          while (state.running && (await awaitValue(evalExpression(stmt.condition, scope)))) {
            const res = await executeStatements(stmt.body, scope);
            if (res) {
              if (res.type === "return") {
                return res;
              }
              if (res.type === "end") {
                return res;
              }
            }
          }
          break;
        case "for": {
          const startVal = await awaitValue(evalExpression(stmt.startExpr, scope));
          const endVal = await awaitValue(evalExpression(stmt.endExpr, scope));
          const stepVal = await awaitValue(evalExpression(stmt.stepExpr, scope));
          const step = Number(stepVal);
          if (!Number.isFinite(step) || step === 0) {
            throw new Error(`Invalid FOR STEP value: ${stmt.stepExpr}`);
          }
          let current = Number(startVal);
          const end = Number(endVal);
          if (!Number.isFinite(current) || !Number.isFinite(end)) {
            throw new Error(`Invalid FOR range`);
          }
          const forward = step > 0;
          const shouldContinue = (val) => (forward ? val <= end : val >= end);
          while (state.running && shouldContinue(current)) {
            setVar(scope, stmt.varName, current);
            const res = await executeStatements(stmt.body, scope);
            if (res) {
              if (res.type === "return") {
                return res;
              }
              if (res.type === "end") {
                return res;
              }
            }
            current += step;
          }
          break;
        }
        case "return":
          return {
            type: "return",
            value: stmt.expr ? await awaitValue(evalExpression(stmt.expr, scope)) : null
          };
        case "end":
          state.running = false;
          return { type: "end" };
        default:
          throw new Error(`Unknown statement: ${stmt.type}`);
      }
    }
    return null;
  }

  const builtins = {
    PRINT: (...args) => {
      pushDisplayOp({
        type: "text",
        text: args.map((val) => String(val)).join(" "),
        color: state.textColor,
        outlineColor: state.textOutlineColor,
        scaleX: state.textScaleX,
        scaleY: state.textScaleY
      });
      return null;
    },
    TEXT: (x, y, text, color) => {
      pushDisplayOp({
        type: "textAt",
        x: Number(x),
        y: Number(y),
        text: String(text),
        color: color ? String(color) : state.textColor,
        outlineColor: state.textOutlineColor,
        scaleX: state.textScaleX,
        scaleY: state.textScaleY
      });
      return null;
    },
    TEXTCENTER: (text, y, color) => {
      const yPos = y !== undefined ? Number(y) : null;
      pushDisplayOp({ type: "textCenter", text: String(text), y: yPos, color: color ? String(color) : state.textColor, outlineColor: state.textOutlineColor, scaleX: state.textScaleX, scaleY: state.textScaleY });
      return null;
    },
    SETTEXTCOLOR: (color) => {
      state.textColor = String(color ?? "#d8f3ff");
      return null;
    },
    SETTEXTSCALEX: (scaleX) => {
      const value = Number(scaleX);
      state.textScaleX = Number.isFinite(value) && value > 0 ? value : 1;
      return null;
    },
    SETTEXTSCALEY: (scaleY) => {
      const value = Number(scaleY);
      state.textScaleY = Number.isFinite(value) && value > 0 ? value : 1;
      return null;
    },
    SETTEXTSCALE: (scaleX, scaleY) => {
      const sx = Number(scaleX);
      const sy = Number(scaleY);
      state.textScaleX = Number.isFinite(sx) && sx > 0 ? sx : 1;
      state.textScaleY = Number.isFinite(sy) && sy > 0 ? sy : 1;
      return null;
    },
    SETTEXTOUTLINE: (color) => {
      state.textOutlineColor = color ? String(color) : null;
      return null;
    },
    SETPENCOLOR: (color) => {
      state.textColor = String(color ?? "#d8f3ff");
      return null;
    },
    PIXELMODE: (mode) => {
      state.pixelMode = Number(mode) ? 1 : 0;
      return null;
    },
    WINDOW: (id, x, y, w, h, r = 0) => {
      const winId = String(id);
      const wx = Number(x);
      const wy = Number(y);
      const ww = Number(w);
      const wh = Number(h);
      const wr = Number(r);
      if (!Number.isFinite(wx) || !Number.isFinite(wy) || !Number.isFinite(ww) || !Number.isFinite(wh)) {
        throw new Error("WINDOW requires numeric x, y, w, h");
      }
      if (ww <= 0 || wh <= 0) {
        throw new Error("WINDOW requires width/height > 0");
      }
      state.windows.set(winId, { x: wx, y: wy, w: ww, h: wh, r: Number.isFinite(wr) ? wr : 0 });
      return null;
    },
    USEWINDOW: (id) => {
      const winId = String(id);
      if (!state.windows.has(winId)) {
        throw new Error(`USEWINDOW unknown id: ${winId}`);
      }
      state.currentWindowId = winId;
      return null;
    },
    NOWINDOW: () => {
      state.currentWindowId = null;
      return null;
    },
    WINDOWX: () => {
      if (state.currentWindowId === null || state.currentWindowId === undefined) {
        return 0;
      }
      const win = state.windows.get(state.currentWindowId);
      return win ? Number(win.x) || 0 : 0;
    },
    WINDOWY: () => {
      if (state.currentWindowId === null || state.currentWindowId === undefined) {
        return 0;
      }
      const win = state.windows.get(state.currentWindowId);
      return win ? Number(win.y) || 0 : 0;
    },
    WINDOWW: () => {
      if (state.currentWindowId === null || state.currentWindowId === undefined) {
        return 0;
      }
      const win = state.windows.get(state.currentWindowId);
      return win ? Number(win.w) || 0 : 0;
    },
    WINDOWH: () => {
      if (state.currentWindowId === null || state.currentWindowId === undefined) {
        return 0;
      }
      const win = state.windows.get(state.currentWindowId);
      return win ? Number(win.h) || 0 : 0;
    },
    WINDOWR: () => {
      if (state.currentWindowId === null || state.currentWindowId === undefined) {
        return 0;
      }
      const win = state.windows.get(state.currentWindowId);
      return win ? (Number(win.x) || 0) + (Number(win.w) || 0) : 0;
    },
    WINDOWB: () => {
      if (state.currentWindowId === null || state.currentWindowId === undefined) {
        return 0;
      }
      const win = state.windows.get(state.currentWindowId);
      return win ? (Number(win.y) || 0) + (Number(win.h) || 0) : 0;
    },
    COLLIDES: (nameA, ax, ay, nameB, bx, by) => {
      const spriteA = state.sprites.get(String(nameA));
      const spriteB = state.sprites.get(String(nameB));
      if (!spriteA || !spriteB) {
        return 0;
      }
      const getSize = (sprite) => {
        if (sprite.type === "bank") {
          const bank = state.spriteBanks.get(sprite.bankId);
          if (bank) {
            return { w: bank.frameW, h: bank.frameH };
          }
        }
        if (sprite.type === "image") {
          const img = sprite.img;
          const w = sprite.w || img?.naturalWidth || img?.width || 0;
          const h = sprite.h || img?.naturalHeight || img?.height || 0;
          return { w, h };
        }
        return { w: sprite.w ?? 0, h: sprite.h ?? 0 };
      };

      const computeAABB = (sprite, x, y) => {
        const { w, h } = getSize(sprite);
        const hotX = Number(sprite.hotX ?? 0) || 0;
        const hotY = Number(sprite.hotY ?? 0) || 0;
        const scaleX = Math.abs(Number(sprite.scaleX ?? 1) || 1);
        const scaleY = Math.abs(Number(sprite.scaleY ?? 1) || 1);
        const rotation = (Number(sprite.rotation ?? 0) || 0) * (Math.PI / 180);
        if (!w || !h) {
          return { left: x, top: y, right: x, bottom: y };
        }

        const cx = Number(x) - hotX + w / 2;
        const cy = Number(y) - hotY + h / 2;
        const halfW = (w * scaleX) / 2;
        const halfH = (h * scaleY) / 2;
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);

        const corners = [
          { x: -halfW, y: -halfH },
          { x: halfW, y: -halfH },
          { x: halfW, y: halfH },
          { x: -halfW, y: halfH }
        ];
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (const p of corners) {
          const rx = p.x * cos - p.y * sin;
          const ry = p.x * sin + p.y * cos;
          const px = cx + rx;
          const py = cy + ry;
          if (px < minX) minX = px;
          if (py < minY) minY = py;
          if (px > maxX) maxX = px;
          if (py > maxY) maxY = py;
        }
        return { left: minX, top: minY, right: maxX, bottom: maxY };
      };

      const a = computeAABB(spriteA, ax, ay);
      const b = computeAABB(spriteB, bx, by);
      const hit = a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      return hit ? 1 : 0;
    },
    RECTHIT: (x1, y1, w1, h1, x2, y2, w2, h2) => {
      const ax = Number(x1);
      const ay = Number(y1);
      const aw = Number(w1);
      const ah = Number(h1);
      const bx = Number(x2);
      const by = Number(y2);
      const bw = Number(w2);
      const bh = Number(h2);
      const hit = ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
      return hit ? 1 : 0;
    },
    ELLIPSEHIT: (cx, cy, rx, ry, px, py) => {
      const dx = Number(px) - Number(cx);
      const dy = Number(py) - Number(cy);
      const rxa = Math.abs(Number(rx)) || 1;
      const rya = Math.abs(Number(ry)) || 1;
      const v = (dx * dx) / (rxa * rxa) + (dy * dy) / (rya * rya);
      return v <= 1 ? 1 : 0;
    },
    RND: (max) => {
      const m = max === undefined ? 1 : Number(max);
      const rand = state.random ? state.random() : Math.random();
      return rand * (Number.isFinite(m) ? m : 1);
    },
    INT: (value) => {
      return Math.floor(Number(value));
    },
    HEX: (value) => {
      const num = Math.floor(Number(value)) & 0xFF;
      return num.toString(16).padStart(2, "0").toUpperCase();
    },
    COS: (radians) => {
      return Math.cos(Number(radians));
    },
    SIN: (radians) => {
      return Math.sin(Number(radians));
    },
    BANKCREATE: (bankId, size) => {
      const id = String(bankId);
      const len = Number(size);
      if (!Number.isFinite(len) || len < 0) {
        throw new Error("BANKCREATE requires size >= 0");
      }
      state.banks.set(id, new Uint8Array(Math.floor(len)));
      return null;
    },
    BANKPEEK: (bankId, index) => {
      const id = String(bankId);
      const idx = Number(index);
      const bank = state.banks.get(id);
      if (!bank) {
        throw new Error(`BANKPEEK bank not found: ${id}`);
      }
      if (!Number.isFinite(idx) || idx < 0 || idx >= bank.length) {
        return 0;
      }
      return bank[Math.floor(idx)];
    },
    BANKPOKE: (bankId, index, value) => {
      const id = String(bankId);
      const idx = Number(index);
      const val = Number(value);
      const bank = state.banks.get(id);
      if (!bank) {
        throw new Error(`BANKPOKE bank not found: ${id}`);
      }
      if (!Number.isFinite(idx) || idx < 0 || idx >= bank.length) {
        return null;
      }
      bank[Math.floor(idx)] = Math.max(0, Math.min(255, Math.floor(val)));
      return null;
    },
    SCREENCAPTURE: (bankId) => {
      const id = String(bankId);
      const bank = state.banks.get(id);
      if (!bank) {
        throw new Error(`SCREENCAPTURE bank not found: ${id}`);
      }
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      if (data.length > bank.length) {
        throw new Error(`SCREENCAPTURE bank too small (need ${data.length}, have ${bank.length})`);
      }
      for (let i = 0; i < data.length; i += 1) {
        bank[i] = data[i];
      }
      return null;
    },
    SCREENDRAW: (bankId) => {
      const id = String(bankId);
      const bank = state.banks.get(id);
      if (!bank) {
        throw new Error(`SCREENDRAW bank not found: ${id}`);
      }
      pushDisplayOp({ type: "screenDraw", bankId: id });
      return null;
    },
    SCREENDRAWRECT: (bankId, x, y, w, h, flipH, flipV) => {
      const id = String(bankId);
      const bank = state.banks.get(id);
      if (!bank) {
        throw new Error(`SCREENDRAWRECT bank not found: ${id}`);
      }
      pushDisplayOp({ type: "screenDrawRect", bankId: id, x: Number(x), y: Number(y), w: Number(w), h: Number(h), flipH: flipH ? 1 : 0, flipV: flipV ? 1 : 0 });
      return null;
    },
    SOUND: (wave, note, seconds) => {
      let type = "sine";
      let isNoise = false;
      if (typeof wave === "number") {
        if (wave === 1) {
          type = "sawtooth";
        } else if (wave === 2) {
          type = "square";
        } else if (wave === 4) {
          isNoise = true;
        }
      } else {
        const typeRaw = String(wave).toLowerCase();
        if (typeRaw === "noise" || typeRaw === "whitenoise" || typeRaw === "white") {
          isNoise = true;
        } else {
          type = typeRaw === "square" || typeRaw === "saw" || typeRaw === "sawtooth"
            ? (typeRaw === "saw" ? "sawtooth" : typeRaw)
            : "sine";
        }
      }
      const duration = Number(seconds);
      if (!Number.isFinite(duration) || duration <= 0) {
        throw new Error("SOUND requires a duration in seconds");
      }
      const ctxAudio = getAudioContext();
      const gain = ctxAudio.createGain();
      gain.gain.value = 0.15;
      gain.connect(ctxAudio.destination);
      const now = ctxAudio.currentTime;

      if (isNoise) {
        const bufferSize = Math.max(1, Math.floor(ctxAudio.sampleRate * duration));
        const buffer = ctxAudio.createBuffer(1, bufferSize, ctxAudio.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i += 1) {
          const rand = state.random ? state.random() : Math.random();
          data[i] = rand * 2 - 1;
        }
        const source = ctxAudio.createBufferSource();
        source.buffer = buffer;
        const filter = ctxAudio.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = Math.max(80, noteToFrequency(note));
        filter.Q.value = 1.2;
        source.connect(filter);
        filter.connect(gain);
        source.start(now);
        source.stop(now + duration);
        return null;
      }

      const freq = noteToFrequency(note);
      const osc = ctxAudio.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + duration);
      return null;
    },
    KEYDOWN: (code) => {
      const key = String(code).toUpperCase();
      if (state.keysDown.has(code)) {
        return 1;
      }
      if (state.keysDown.has(key)) {
        return 1;
      }
      return 0;
    },
    LASTKEY: () => {
      return state.lastKey;
    },
    STRLEN: (text) => {
      return String(text).length;
    },
    LINE: (x1, y1, x2, y2, color) => {
      pushDisplayOp({
        type: "line",
        x1: Number(x1),
        y1: Number(y1),
        x2: Number(x2),
        y2: Number(y2),
        color: color ? String(color) : state.textColor
      });
      return null;
    },
    RECT: (x, y, w, h, color) => {
      pushDisplayOp({
        type: "rect",
        x: Number(x),
        y: Number(y),
        w: Number(w),
        h: Number(h),
        color: color ? String(color) : state.textColor
      });
      return null;
    },
    FRECT: (x, y, w, h, color) => {
      pushDisplayOp({
        type: "fillRect",
        x: Number(x),
        y: Number(y),
        w: Number(w),
        h: Number(h),
        color: color ? String(color) : state.textColor
      });
      return null;
    },
    ELLIPSE: (x, y, rx, ry, color) => {
      pushDisplayOp({
        type: "ellipse",
        x: Number(x),
        y: Number(y),
        rx: Math.abs(Number(rx)),
        ry: Math.abs(Number(ry)),
        color: color ? String(color) : state.textColor
      });
      return null;
    },
    FELLIPSE: (x, y, rx, ry, color) => {
      pushDisplayOp({
        type: "fillEllipse",
        x: Number(x),
        y: Number(y),
        rx: Math.abs(Number(rx)),
        ry: Math.abs(Number(ry)),
        color: color ? String(color) : state.textColor
      });
      return null;
    },
    ARC: (x, y, r, startDeg, endDeg, color) => {
      pushDisplayOp({
        type: "arc",
        x: Number(x),
        y: Number(y),
        r: Math.abs(Number(r)),
        start: (Number(startDeg) * Math.PI) / 180,
        end: (Number(endDeg) * Math.PI) / 180,
        color: color ? String(color) : state.textColor
      });
      return null;
    },
    FARC: (x, y, r, startDeg, endDeg, color) => {
      pushDisplayOp({
        type: "fillArc",
        x: Number(x),
        y: Number(y),
        r: Math.abs(Number(r)),
        start: (Number(startDeg) * Math.PI) / 180,
        end: (Number(endDeg) * Math.PI) / 180,
        color: color ? String(color) : state.textColor
      });
      return null;
    },
    POLY: (...args) => {
      const last = args[args.length - 1];
      const color = typeof last === "string" ? String(last) : null;
      const values = color ? args.slice(0, -1) : args;
      if (values.length < 6 || values.length % 2 !== 0) {
        throw new Error("POLY requires an even number of coordinates (x1,y1,...) and at least 3 points");
      }
      const points = [];
      for (let i = 0; i < values.length; i += 2) {
        points.push({ x: Number(values[i]), y: Number(values[i + 1]) });
      }
      pushDisplayOp({
        type: "poly",
        points,
        color: color ?? state.textColor
      });
      return null;
    },
    FPOLY: (...args) => {
      const last = args[args.length - 1];
      const color = typeof last === "string" ? String(last) : null;
      const values = color ? args.slice(0, -1) : args;
      if (values.length < 6 || values.length % 2 !== 0) {
        throw new Error("FPOLY requires an even number of coordinates (x1,y1,...) and at least 3 points");
      }
      const points = [];
      for (let i = 0; i < values.length; i += 2) {
        points.push({ x: Number(values[i]), y: Number(values[i + 1]) });
      }
      pushDisplayOp({
        type: "fillPoly",
        points,
        color: color ?? state.textColor
      });
      return null;
    },
    BANKLOAD: (bankId, data) => {
      const id = Number(bankId);
      if (!Number.isFinite(id)) {
        throw new Error("BANKLOAD requires a numeric bank id");
      }
      if (data === undefined) {
        throw new Error("BANKLOAD requires data: BANKLOAD(id, \"hex...\")");
      }
      const bytes = parseBankData(data);
      state.banks.set(id, bytes);
      return null;
    },
    BANKFREE: (bankId) => {
      const id = Number(bankId);
      state.banks.delete(id);
      state.spriteBanks.delete(id);
      if (state.fontBank === id) {
        state.fontBank = 0;
      }
      return null;
    },
    BANKLOADSPRITE: (bankId, dataUrl, frameW, frameH) => {
      const id = Number(bankId);
      const w = Number(frameW);
      const h = Number(frameH);
      if (!Number.isFinite(id)) {
        throw new Error("BANKLOADSPRITE requires a numeric bank id");
      }
      if (!dataUrl) {
        throw new Error("BANKLOADSPRITE requires a data URL");
      }
      if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
        throw new Error("BANKLOADSPRITE requires valid frame width/height");
      }
      const img = new Image();
      const bank = {
        img,
        loaded: false,
        frameW: Math.floor(w),
        frameH: Math.floor(h),
        framesPerRow: 1,
        frameCount: 0
      };
      img.onload = () => {
        bank.loaded = true;
        bank.framesPerRow = Math.max(1, Math.floor(img.width / bank.frameW));
        const rows = Math.max(1, Math.floor(img.height / bank.frameH));
        bank.frameCount = bank.framesPerRow * rows;
      };
      img.src = String(dataUrl);
      state.spriteBanks.set(id, bank);
      return null;
    },
    // Tilemap support
    TILEMAP_CREATE: (id, cols, rows) => {
      const key = String(id);
      const c = Math.floor(Number(cols));
      const r = Math.floor(Number(rows));
      if (!Number.isFinite(c) || c <= 0 || !Number.isFinite(r) || r <= 0) {
        throw new Error('TILEMAP_CREATE requires numeric cols and rows');
      }
      state.tilemaps.set(key, { cols: c, rows: r, data: new Array(c * r).fill(0) });
      return null;
    },
    TILEMAP_SET: (id, x, y, value) => {
      const key = String(id);
      const map = state.tilemaps.get(key);
      if (!map) throw new Error(`TILEMAP_SET: map not found: ${key}`);
      const xi = Math.floor(Number(x));
      const yi = Math.floor(Number(y));
      if (!Number.isFinite(xi) || !Number.isFinite(yi) || xi < 0 || yi < 0 || xi >= map.cols || yi >= map.rows) {
        throw new Error(`TILEMAP_SET: coordinates out of range: ${xi},${yi}`);
      }
      map.data[yi * map.cols + xi] = Number(value) || 0;
      return null;
    },
    TILEMAP_GET: (id, x, y) => {
      const key = String(id);
      const map = state.tilemaps.get(key);
      if (!map) throw new Error(`TILEMAP_GET: map not found: ${key}`);
      const xi = Math.floor(Number(x));
      const yi = Math.floor(Number(y));
      if (!Number.isFinite(xi) || !Number.isFinite(yi) || xi < 0 || yi < 0 || xi >= map.cols || yi >= map.rows) {
        throw new Error(`TILEMAP_GET: coordinates out of range: ${xi},${yi}`);
      }
      return map.data[yi * map.cols + xi];
    },
    TILEMAP_FILL: (id, value) => {
      const key = String(id);
      const map = state.tilemaps.get(key);
      if (!map) throw new Error(`TILEMAP_FILL: map not found: ${key}`);
      const v = Number(value) || 0;
      for (let i = 0; i < map.data.length; i += 1) map.data[i] = v;
      return null;
    },
    TILEMAP_COLLIDE: (id, x, y, value) => {
      const key = String(id);
      const map = state.tilemaps.get(key);
      if (!map) return 0;
      const xi = Math.floor(Number(x));
      const yi = Math.floor(Number(y));
      if (!Number.isFinite(xi) || !Number.isFinite(yi)) return 0;
      if (xi < 0 || yi < 0 || xi >= map.cols || yi >= map.rows) return 0;
      const v = Number(value) || 0;
      return map.data[yi * map.cols + xi] === v ? 1 : 0;
    },
    TILEMAP_COLLIDE_RECT: (id, x, y, w, h, value) => {
      const key = String(id);
      const map = state.tilemaps.get(key);
      if (!map) return 0;
      const xi = Math.floor(Number(x));
      const yi = Math.floor(Number(y));
      const wi = Math.floor(Number(w));
      const hi = Math.floor(Number(h));
      if (!Number.isFinite(xi) || !Number.isFinite(yi) || !Number.isFinite(wi) || !Number.isFinite(hi)) return 0;
      const v = Number(value) || 0;
      const x0 = Math.max(0, xi);
      const y0 = Math.max(0, yi);
      const x1 = Math.min(map.cols - 1, xi + wi - 1);
      const y1 = Math.min(map.rows - 1, yi + hi - 1);
      if (x1 < x0 || y1 < y0) return 0;
      for (let ry = y0; ry <= y1; ry += 1) {
        for (let cx = x0; cx <= x1; cx += 1) {
          if (map.data[ry * map.cols + cx] === v) return 1;
        }
      }
      return 0;
    },
    // Pixel-based collision helpers (tile size default 8)
    TILEMAP_COLLIDE_PIXEL: (id, px, py, value, tileSize = 8) => {
      const key = String(id);
      const map = state.tilemaps.get(key);
      if (!map) return 0;
      const ts = Math.max(1, Math.floor(Number(tileSize)));
      const xi = Math.floor(Number(px) / ts);
      const yi = Math.floor(Number(py) / ts);
      if (!Number.isFinite(xi) || !Number.isFinite(yi)) return 0;
      if (xi < 0 || yi < 0 || xi >= map.cols || yi >= map.rows) return 0;
      const v = Number(value) || 0;
      return map.data[yi * map.cols + xi] === v ? 1 : 0;
    },
    TILEMAP_COLLIDE_RECT_PIXEL: (id, px, py, pw, ph, value, tileSize = 8) => {
      const key = String(id);
      const map = state.tilemaps.get(key);
      if (!map) return 0;
      const ts = Math.max(1, Math.floor(Number(tileSize)));
      const x0 = Math.floor(Number(px) / ts);
      const y0 = Math.floor(Number(py) / ts);
      const x1 = Math.floor((Number(px) + Number(pw) - 1) / ts);
      const y1 = Math.floor((Number(py) + Number(ph) - 1) / ts);
      if (!Number.isFinite(x0) || !Number.isFinite(y0) || !Number.isFinite(x1) || !Number.isFinite(y1)) return 0;
      const ax0 = Math.max(0, x0);
      const ay0 = Math.max(0, y0);
      const ax1 = Math.min(map.cols - 1, x1);
      const ay1 = Math.min(map.rows - 1, y1);
      if (ax1 < ax0 || ay1 < ay0) return 0;
      const v = Number(value) || 0;
      for (let ry = ay0; ry <= ay1; ry += 1) {
        for (let cx = ax0; cx <= ax1; cx += 1) {
          if (map.data[ry * map.cols + cx] === v) return 1;
        }
      }
      return 0;
    },
    TILEMAP_DRAW: (id, x, y, bankId, scale = 1) => {
      const key = String(id);
      const map = state.tilemaps.get(key);
      if (!map) throw new Error(`TILEMAP_DRAW: map not found: ${key}`);
      const bx = Math.floor(Number(x)) || 0;
      const by = Math.floor(Number(y)) || 0;
      const bId = Number(bankId);
      if (!Number.isFinite(bId)) throw new Error('TILEMAP_DRAW requires a numeric bankId');
      const s = Number(scale) || 1;
      pushDisplayOp({ type: 'tilemap', mapId: key, x: bx, y: by, bankId: bId, scale: s });
      return null;
    },
    BANKCOPY: (srcId, dstId) => {
      const src = Number(srcId);
      const dst = Number(dstId);
      const data = state.banks.get(src);
      if (!data) {
        throw new Error(`BANKCOPY source bank not found: ${src}`);
      }
      state.banks.set(dst, new Uint8Array(data));
      return null;
    },
    SETFONT: (bankId) => {
      const id = Number(bankId);
      const data = state.banks.get(id);
      if (!data || data.length < 128 * 8) {
        throw new Error("SETFONT requires a bank with 1024 bytes (128x8)");
      }
      state.fontBank = id;
      return null;
    },
    CLS: () => {
      clearOutput();
      return null;
    },
    CLEARSCREEN: () => {
      state.displayOps = [];
      return null;
    },
    BORDER: (color) => {
      state.borderColor = String(color ?? "#0a1018");
      if (popoutWindow && !popoutWindow.closed) {
        popoutWindow.document.body.style.background = state.borderColor;
      }
      return null;
    },
    SCREENBG: (color) => {
      const value = String(color ?? "#0a1018");
      if (state.currentWindowId !== null && state.currentWindowId !== undefined) {
        const win = state.windows.get(state.currentWindowId);
        if (win) {
          win.bg = value;
          return null;
        }
      }
      state.screenBg = value;
      return null;
    },
    FLIP: () => {
      return new Promise((resolve) => {
        const frameHost = (popoutWindow && !popoutWindow.closed) ? popoutWindow : window;
        const raf = frameHost.requestAnimationFrame.bind(frameHost);
        const now = (frameHost.performance || performance).now();
        const fps = Math.max(1, Number(state.targetFps) || 60);
        const frameMs = 1000 / fps;
        if (state.nextFrameTime <= now) {
          state.nextFrameTime = now + frameMs;
        }
        const delay = Math.max(0, state.nextFrameTime - now);
        const schedule = () => {
          raf(() => {
            renderDisplay();
            resolve(null);
          });
        };
        if (delay > 1) {
          frameHost.setTimeout(schedule, delay);
        } else {
          schedule();
        }
        state.nextFrameTime += frameMs;
      });
    },
    SETFPS: (fps) => {
      const value = Number(fps);
      if (!Number.isFinite(value) || value <= 0) {
        throw new Error("SETFPS requires a positive number");
      }
      state.targetFps = value;
      state.nextFrameTime = 0;
      return null;
    },
    INPUT: (promptText = "INPUT:", cursorChar = "_", maxLen = null) => {
      return startInputPrompt(promptText, cursorChar, maxLen);
    },
    WAIT: (seconds) => {
      const sec = Number(seconds);
      const ms = Number.isFinite(sec) ? Math.max(0, sec * 1000) : 0;
      return new Promise((resolve) => {
        const timerHost = (popoutWindow && !popoutWindow.closed) ? popoutWindow : window;
        timerHost.setTimeout(() => resolve(null), ms);
      });
    },
    SPRITE: (name, widthOrUrl, height, color) => {
      const spriteName = String(name);
      if (typeof widthOrUrl === "string" && height === undefined) {
        const img = new Image();
        img.src = widthOrUrl;
        state.sprites.set(spriteName, {
          type: "image",
          img,
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          hotX: 0,
          hotY: 0,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          flipX: 0,
          flipY: 0
        });
        return null;
      }
      const w = Number(widthOrUrl ?? 0);
      const h = Number(height ?? 0);
      const col = color ? String(color) : "#ffffff";
      state.sprites.set(spriteName, {
        type: "rect",
        w,
        h,
        color: col,
        x: 0,
        y: 0,
        hotX: 0,
        hotY: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        flipX: 0,
        flipY: 0
      });
      return null;
    },
    SPRITEBANK: (name, bankId, frameIndex = 0) => {
      const spriteName = String(name);
      const id = Number(bankId);
      if (!Number.isFinite(id)) {
        throw new Error("SPRITEBANK requires a numeric bank id");
      }
      state.sprites.set(spriteName, {
        type: "bank",
        bankId: id,
        frame: Number(frameIndex) || 0,
        x: 0,
        y: 0,
        hotX: 0,
        hotY: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        flipX: 0,
        flipY: 0
      });
      return null;
    },
    SETSPRITEFRAME: (name, frameIndex = 0) => {
      const sprite = state.sprites.get(String(name));
      if (!sprite || sprite.type !== "bank") {
        throw new Error(`SETSPRITEFRAME requires a bank sprite: ${name}`);
      }
      sprite.frame = Number(frameIndex) || 0;
      return null;
    },
    SETSPRITETRANSFORM: (name, scaleX = 1, scaleY = 1, rotation = 0, flipX = 0, flipY = 0) => {
      const sprite = state.sprites.get(String(name));
      if (!sprite) {
        throw new Error(`Sprite not found: ${name}`);
      }
      sprite.scaleX = Number(scaleX) || 1;
      sprite.scaleY = Number(scaleY) || 1;
      sprite.rotation = Number(rotation) || 0;
      sprite.flipX = Number(flipX) ? 1 : 0;
      sprite.flipY = Number(flipY) ? 1 : 0;
      return null;
    },
    SETHOTSPOT: (name, hotX = 0, hotY = 0) => {
      const sprite = state.sprites.get(String(name));
      if (!sprite) {
        throw new Error(`Sprite not found: ${name}`);
      }
      sprite.hotX = Number(hotX) || 0;
      sprite.hotY = Number(hotY) || 0;
      return null;
    },
    DRAWSPRITE: (name, x, y) => {
      const sprite = state.sprites.get(String(name));
      if (!sprite) {
        throw new Error(`Sprite not found: ${name}`);
      }
      const px = Number(x);
      const py = Number(y);
      sprite.x = px;
      sprite.y = py;
      pushDisplayOp({ type: "sprite", name: String(name), x: px, y: py });
      return null;
    },
    MOVESPRITE: (name, x, y) => {
      const sprite = state.sprites.get(String(name));
      if (!sprite) {
        throw new Error(`Sprite not found: ${name}`);
      }
      sprite.x = Number(x);
      sprite.y = Number(y);
      return null;
    },
    SPRITEX: (name) => {
      const sprite = state.sprites.get(String(name));
      if (!sprite) {
        throw new Error(`Sprite not found: ${name}`);
      }
      return Number(sprite.x) || 0;
    },
    SPRITEY: (name) => {
      const sprite = state.sprites.get(String(name));
      if (!sprite) {
        throw new Error(`Sprite not found: ${name}`);
      }
      return Number(sprite.y) || 0;
    },
    SPRITEFRAME: (name) => {
      const sprite = state.sprites.get(String(name));
      if (!sprite) {
        throw new Error(`Sprite not found: ${name}`);
      }
      return Number(sprite.frame ?? 0) || 0;
    },
    SPRITESCALEX: (name) => {
      const sprite = state.sprites.get(String(name));
      if (!sprite) {
        throw new Error(`Sprite not found: ${name}`);
      }
      return Number(sprite.scaleX ?? 1) || 1;
    },
    SPRITESCALEY: (name) => {
      const sprite = state.sprites.get(String(name));
      if (!sprite) {
        throw new Error(`Sprite not found: ${name}`);
      }
      return Number(sprite.scaleY ?? 1) || 1;
    },
    SPRITEROT: (name) => {
      const sprite = state.sprites.get(String(name));
      if (!sprite) {
        throw new Error(`Sprite not found: ${name}`);
      }
      return Number(sprite.rotation ?? 0) || 0;
    }
  };

  async function runProgram() {
    // Stop any running program first
    if (state.running) {
      state.running = false;
      return;
    }

    clearOutput();
    clearScreen();
    resetState();

    let parsed;
    try {
      parsed = parseProgram(programInput.value);
    } catch (error) {
      printLine(error.message);
      renderDisplay();
      return;
    }

    state.statements = parsed.statements;
    state.functions = parsed.functions;
    state.dataList = parsed.dataList;
    state.dataIdMap = parsed.dataIdMap;
    state.dataIndex = 0;
    state.running = true;

    try {
      await executeStatements(state.statements, state.vars);
    } catch (error) {
      if (state.currentLine) {
        printLine(`ERROR (line ${state.currentLine}): ${error.message}`);
      } else {
        printLine(`ERROR: ${error.message}`);
      }
      state.running = false;
      renderDisplay();
    }
  }

  function stopProgram() {
    state.running = false;
    printLine("[Stopped]");
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function highlightCode(source) {
    const keywords = [
      "REM",
      "LET",
      "DIM",
      "IF",
      "ELSE",
      "ELSEIF",
      "THEN",
      "ENDIF",
      "FOR",
      "TO",
      "STEP",
      "NEXT",
      "WHILE",
      "ENDWHILE",
      "FUNC",
      "RETURN",
      "END",
      "SEED"
    ];

    const tokenRegex = new RegExp(
      [
        "(\\/\\*[\\s\\S]*?\\*\\/)",
        "(REM.*$)",
        "(//.*$)",
        "(\"[^\"]*\")",
        "(\\b\\d+\\.?\\d*\\b)",
        "(\\b[A-Za-z_][A-Za-z0-9_]*\\b(?=\\())",
        `(\\b(?:${keywords.join("|")})\\b)`,
        "(<=|>=|!=|=|\\+|-|\\*|/|<|>)"
      ].join("|"),
      "gmi"
    );

    let out = "";
    let lastIndex = 0;
    let match;
    while ((match = tokenRegex.exec(source)) !== null) {
      const [text] = match;
      const index = match.index;
      out += escapeHtml(source.slice(lastIndex, index));

      let cls = "";
      if (match[1] || match[2] || match[3]) {
        cls = "tok-comment";
      } else if (match[4]) {
        cls = "tok-string";
      } else if (match[5]) {
        cls = "tok-number";
      } else if (match[6]) {
        cls = "tok-func";
      } else if (match[7]) {
        cls = "tok-keyword";
      } else if (match[8]) {
        cls = "tok-operator";
      }

      out += `<span class="${cls}">${escapeHtml(text)}</span>`;
      lastIndex = index + text.length;
    }

    out += escapeHtml(source.slice(lastIndex));
    return out;
  }

  function syncHighlight() {
    const value = programInput.value.replace(/\r\n/g, "\n");
    highlight.innerHTML = highlightCode(value) + "\n";
    highlight.scrollTop = programInput.scrollTop;
    highlight.scrollLeft = programInput.scrollLeft;
  }

  let wrapMeasureEl = null;
  function syncLineNumbers() {
    const value = programInput.value.replace(/\r\n/g, "\n");
    const lines = value.split("\n");
    const style = getComputedStyle(programInput);
    const paddingLeft = parseFloat(style.paddingLeft) || 0;
    const paddingRight = parseFloat(style.paddingRight) || 0;
    const contentWidth = Math.max(1, programInput.clientWidth - paddingLeft - paddingRight);
    const lineHeight = parseFloat(style.lineHeight) || 20;
    if (!wrapMeasureEl) {
      wrapMeasureEl = document.createElement("div");
      wrapMeasureEl.style.position = "absolute";
      wrapMeasureEl.style.visibility = "hidden";
      wrapMeasureEl.style.whiteSpace = "pre-wrap";
      wrapMeasureEl.style.wordBreak = "break-word";
      wrapMeasureEl.style.overflowWrap = "anywhere";
      wrapMeasureEl.style.left = "-9999px";
      wrapMeasureEl.style.top = "-9999px";
      document.body.appendChild(wrapMeasureEl);
    }
    wrapMeasureEl.style.fontFamily = style.fontFamily;
    wrapMeasureEl.style.fontSize = style.fontSize;
    wrapMeasureEl.style.lineHeight = style.lineHeight;
    wrapMeasureEl.style.width = `${contentWidth}px`;

    let nums = "";
    let lineNum = 1;
    for (const line of lines) {
      wrapMeasureEl.textContent = line.length ? line : " ";
      const height = Math.max(1, wrapMeasureEl.getBoundingClientRect().height);
      const wraps = Math.max(1, Math.round(height / lineHeight));
      nums += lineNum + "\n";
      for (let w = 1; w < wraps; w += 1) {
        nums += "\n";
      }
      lineNum += 1;
    }
    lineNumbers.textContent = nums;
    lineNumbers.scrollTop = programInput.scrollTop;
  }

  async function saveProgram() {
    const content = programInput.value;
    if (window.showSaveFilePicker && window.isSecureContext) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: "program.basic",
          types: [
            {
              description: "GameBASIC Program",
              accept: { "text/plain": [".basic", ".bas", ".txt"] }
            }
          ]
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        return;
      } catch (error) {
        if (error && error.name === "AbortError") {
          return;
        }
      }
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "program.basic";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function loadProgram() {
    fileInput.value = "";
    fileInput.click();
  }

  let spriteDrawing = false;
  let spriteDrawButton = 0;
  let spriteDataUrlRaf = null;
  let spriteTool = "brush";
  const spriteHistory = [];
  const spriteRedoHistory = [];
  const spriteHistoryLimit = 50;

  function openSpriteEditor() {
    spriteEditorModal.classList.add("open");
    spriteEditorModal.setAttribute("aria-hidden", "false");
    updateSpriteCanvasDisplaySize();
    updateSpriteGrid();
    scheduleSpriteDataUrlUpdate();
  }

  function closeSpriteEditor() {
    spriteEditorModal.classList.remove("open");
    spriteEditorModal.setAttribute("aria-hidden", "true");
  }

  function scheduleSpriteDataUrlUpdate() {
    if (spriteDataUrlRaf !== null) {
      return;
    }
    spriteDataUrlRaf = requestAnimationFrame(() => {
      spriteDataUrlRaf = null;
      spriteDataUrl.value = spriteEditorCanvas.toDataURL("image/png");
    });
  }

  function parsePositiveInt(value, fallback) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
    return fallback;
  }

  function setSpriteTool(tool) {
    spriteTool = tool;
    spriteToolBrush.classList.toggle("active", tool === "brush");
    spriteToolFill.classList.toggle("active", tool === "fill");
  }

  function captureSpriteState() {
    const width = spriteEditorCanvas.width;
    const height = spriteEditorCanvas.height;
    return {
      width,
      height,
      data: spriteCtx.getImageData(0, 0, width, height)
    };
  }

  function restoreSpriteState(state) {
    resizeSpriteCanvas(state.width, state.height, false);
    spriteCtx.putImageData(state.data, 0, 0);
    scheduleSpriteDataUrlUpdate();
  }

  function updateSpriteHistoryButtons() {
    if (spriteUndoBtn) {
      spriteUndoBtn.disabled = spriteHistory.length === 0;
    }
    if (spriteRedoBtn) {
      spriteRedoBtn.disabled = spriteRedoHistory.length === 0;
    }
  }

  function pushSpriteHistory() {
    spriteHistory.push(captureSpriteState());
    if (spriteHistory.length > spriteHistoryLimit) {
      spriteHistory.shift();
    }
    spriteRedoHistory.length = 0;
    updateSpriteHistoryButtons();
  }

  function undoSprite() {
    if (spriteHistory.length === 0) {
      return;
    }
    const current = captureSpriteState();
    const previous = spriteHistory.pop();
    spriteRedoHistory.push(current);
    restoreSpriteState(previous);
    updateSpriteHistoryButtons();
  }

  function redoSprite() {
    if (spriteRedoHistory.length === 0) {
      return;
    }
    const current = captureSpriteState();
    const next = spriteRedoHistory.pop();
    spriteHistory.push(current);
    restoreSpriteState(next);
    updateSpriteHistoryButtons();
  }

  function hexToRgba(hex) {
    const value = hex.replace("#", "").trim();
    if (value.length !== 6) {
      return { r: 0, g: 0, b: 0, a: 255 };
    }
    return {
      r: Number.parseInt(value.slice(0, 2), 16),
      g: Number.parseInt(value.slice(2, 4), 16),
      b: Number.parseInt(value.slice(4, 6), 16),
      a: 255
    };
  }

  function floodFillSprite(x, y, button) {
    const width = spriteEditorCanvas.width;
    const height = spriteEditorCanvas.height;
    const imageData = spriteCtx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const startIndex = (y * width + x) * 4;
    const startR = data[startIndex];
    const startG = data[startIndex + 1];
    const startB = data[startIndex + 2];
    const startA = data[startIndex + 3];
    const fillColor = button === 2 ? { r: 0, g: 0, b: 0, a: 0 } : hexToRgba(spriteColorInput.value);

    if (
      startR === fillColor.r &&
      startG === fillColor.g &&
      startB === fillColor.b &&
      startA === fillColor.a
    ) {
      return;
    }

    const stack = [[x, y]];
    while (stack.length) {
      const [cx, cy] = stack.pop();
      if (cx < 0 || cy < 0 || cx >= width || cy >= height) {
        continue;
      }
      const idx = (cy * width + cx) * 4;
      if (
        data[idx] !== startR ||
        data[idx + 1] !== startG ||
        data[idx + 2] !== startB ||
        data[idx + 3] !== startA
      ) {
        continue;
      }
      data[idx] = fillColor.r;
      data[idx + 1] = fillColor.g;
      data[idx + 2] = fillColor.b;
      data[idx + 3] = fillColor.a;
      stack.push([cx + 1, cy]);
      stack.push([cx - 1, cy]);
      stack.push([cx, cy + 1]);
      stack.push([cx, cy - 1]);
    }
    spriteCtx.putImageData(imageData, 0, 0);
    scheduleSpriteDataUrlUpdate();
  }

  function updateSpriteCanvasDisplaySize() {
    const wrap = spriteCanvasStage.parentElement;
    if (!wrap) {
      return;
    }
    const availableWidth = Math.max(wrap.clientWidth, 1);
    const maxWidth = Math.min(640, availableWidth);
    const scaleX = maxWidth / spriteEditorCanvas.width;
    let scale = Math.floor(scaleX);
    if (!Number.isFinite(scale) || scale < 1) {
      scale = 1;
    }
    const stageWidth = spriteEditorCanvas.width * scale;
    const stageHeight = spriteEditorCanvas.height * scale;
    spriteCanvasStage.style.width = `${stageWidth}px`;
    spriteCanvasStage.style.height = `${stageHeight}px`;
  }

  function resizeSpriteCanvas(width, height, preserve = true) {
    const safeWidth = Math.min(Math.max(width, 1), 2048);
    const safeHeight = Math.min(Math.max(height, 1), 2048);
    const temp = document.createElement("canvas");
    temp.width = spriteEditorCanvas.width;
    temp.height = spriteEditorCanvas.height;
    temp.getContext("2d").drawImage(spriteEditorCanvas, 0, 0);
    spriteEditorCanvas.width = safeWidth;
    spriteEditorCanvas.height = safeHeight;
    spriteGridCanvas.width = safeWidth;
    spriteGridCanvas.height = safeHeight;
    spriteCtx.imageSmoothingEnabled = false;
    spriteGridCtx.imageSmoothingEnabled = false;
    if (preserve) {
      spriteCtx.drawImage(temp, 0, 0);
    }
    updateSpriteCanvasDisplaySize();
    updateSpriteGrid();
    scheduleSpriteDataUrlUpdate();
  }

  function updateSpriteGrid() {
    spriteGridCtx.setTransform(1, 0, 0, 1, 0, 0);
    spriteGridCtx.clearRect(0, 0, spriteGridCanvas.width, spriteGridCanvas.height);
    if (!spriteGridToggle.checked) {
      return;
    }
    const width = spriteGridCanvas.width;
    const height = spriteGridCanvas.height;
    const maxX = width - 1;
    const maxY = height - 1;
    const frameW = parsePositiveInt(spriteFrameWInput.value, 1);
    const frameH = parsePositiveInt(spriteFrameHInput.value, 1);

    spriteGridCtx.fillStyle = "rgba(255,255,255,0.4)";
    for (let x = frameW; x < maxX; x += frameW) {
      spriteGridCtx.fillRect(x, 0, 1, height);
    }
    for (let y = frameH; y < maxY; y += frameH) {
      spriteGridCtx.fillRect(0, y, width, 1);
    }
  }

  function getSpritePointerPosition(event) {
    const rect = spriteEditorCanvas.getBoundingClientRect();
    const scaleX = spriteEditorCanvas.width / rect.width;
    const scaleY = spriteEditorCanvas.height / rect.height;
    let x = Math.floor((event.clientX - rect.left) * scaleX);
    let y = Math.floor((event.clientY - rect.top) * scaleY);
    x = Math.min(Math.max(x, 0), spriteEditorCanvas.width - 1);
    y = Math.min(Math.max(y, 0), spriteEditorCanvas.height - 1);
    return { x, y };
  }

  function applySpriteBrush(x, y, button) {
    const size = parsePositiveInt(spriteBrushInput.value, 1);
    if (button === 2) {
      spriteCtx.clearRect(x, y, size, size);
    } else {
      spriteCtx.fillStyle = spriteColorInput.value;
      spriteCtx.fillRect(x, y, size, size);
    }
    scheduleSpriteDataUrlUpdate();
  }

  fileInput.addEventListener("change", () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      programInput.value = String(reader.result ?? "");
      syncHighlight();
      syncLineNumbers();
    };
    reader.readAsText(file);
  });

  runBtn.addEventListener("click", () => {
    programInput.blur();
    canvas.focus?.();
    void runProgram();
  });
  screenSize.addEventListener("change", () => {
    if (popoutWindow && !popoutWindow.closed) {
      return;
    }
    applyScreenSize(screenSize.value);
  });
  popoutBtn.addEventListener("click", () => {
    if (popoutWindow && !popoutWindow.closed) {
      popoutWindow.close();
      popoutWindow = null;
      if (popoutPoll) {
        clearInterval(popoutPoll);
        popoutPoll = null;
      }
      attachCanvasToHost();
      applyScreenSize(screenSize.value);
      return;
    }
    openPopout();
  });
  stopBtn.addEventListener("click", stopProgram);
  saveBtn.addEventListener("click", saveProgram);
  loadBtn.addEventListener("click", loadProgram);
  if (exportHtmlBtn) {
    exportHtmlBtn.addEventListener("click", async () => {
      const code = programInput.value.replace(/\r\n/g, "\n");
      const encodeBase64 = (text) => {
        if (window.TextEncoder) {
          const bytes = new TextEncoder().encode(text);
          let binary = "";
          bytes.forEach((b) => {
            binary += String.fromCharCode(b);
          });
          return btoa(binary);
        }
        return btoa(unescape(encodeURIComponent(text)));
      };
      const b64 = encodeBase64(code);
      let engineSource = "";
      try {
        const resp = await fetch("engine.js", { cache: "no-store" });
        if (resp.ok) {
          engineSource = await resp.text();
        }
      } catch (err) {
        engineSource = "";
      }
      const compactEngineSource = engineSource
        .replace(/const sample = `[\s\S]*?`\s*;\s*programInput\.value = sample;?/m, "");
      const enginePayload = compactEngineSource ? encodeBase64(compactEngineSource) : "";
      const engineTag = enginePayload
        ? `<script>(function(){var b64="${enginePayload}";var binary=atob(b64);var code;if(window.TextDecoder){var bytes=Uint8Array.from(binary,function(ch){return ch.charCodeAt(0);});code=new TextDecoder().decode(bytes);}else{code=decodeURIComponent(escape(binary));}var s=document.createElement("script");s.text=code;document.head.appendChild(s);})();</script>`
        : `<script src=\"engine.js\"></script>`;
      const exportScale = screenSize?.value === "1x" ? 1 : 2;
      const runnerHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>GameBASIC Runner</title>
  <style>
    :root { color-scheme: light dark; }
    body {
      margin: 0;
      background: #0b0f14;
      color: #e6edf3;
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      overflow: hidden;
    }
    #screenHost {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
    #screen {
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    }
    .hidden-ui {
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <div id="screenHost">
    <canvas id="screen" width="320" height="200"></canvas>
  </div>

  <div class="hidden-ui">
    <button id="runBtn">Run</button>
    <button id="stopBtn">Stop</button>
    <button id="saveBtn">Save</button>
    <button id="loadBtn">Load</button>
    <input id="fileInput" type="file" />
    <pre id="highlight"></pre>
    <pre id="lineNumbers"></pre>
    <textarea id="programInput"></textarea>
    <select id="screenSize">
      <option value="2x" selected>640x400</option>
      <option value="1x">320x200</option>
    </select>
    <button id="popoutBtn">Pop out</button>

    <button id="spriteEditorBtn" type="button">Sprite Editor</button>
    <div id="spriteEditorModal" aria-hidden="true"></div>
    <button id="spriteEditorClose" type="button">Close</button>
    <input id="spriteFileInput" type="file" />
    <button id="spriteLoadBtn" type="button">Load PNG</button>
    <button id="spriteSaveBtn" type="button">Save PNG</button>
    <button id="spriteUndoBtn" type="button">Undo</button>
    <button id="spriteRedoBtn" type="button">Redo</button>
    <input id="spriteWidth" type="number" value="64" />
    <input id="spriteHeight" type="number" value="64" />
    <button id="spriteResizeBtn" type="button">Set Size</button>
    <input id="spriteFrameW" type="number" value="16" />
    <input id="spriteFrameH" type="number" value="16" />
    <button id="spriteToolBrush" type="button">Brush</button>
    <button id="spriteToolFill" type="button">Fill</button>
    <input id="spriteBrush" type="number" value="1" />
    <input id="spriteColor" type="color" value="#ffd166" />
    <input id="spriteGridToggle" type="checkbox" checked />
    <div id="spriteCanvasStage"></div>
    <canvas id="spriteEditorCanvas" width="64" height="64"></canvas>
    <canvas id="spriteGridCanvas" width="64" height="64"></canvas>
    <textarea id="spriteDataUrl"></textarea>
    <button id="spriteCopyBtn" type="button">Copy</button>
  </div>

  ${engineTag}
  <script>
    (function () {
      const canvas = document.getElementById("screen");
      const host = document.getElementById("screenHost");
      const resizeCanvas = () => {
        const maxW = window.innerWidth;
        const maxH = window.innerHeight;
        const scale = Math.max(1, Math.floor(Math.min(maxW / 320, maxH / 200)));
        const targetW = 320 * scale;
        const targetH = 200 * scale;
        if (canvas) {
          canvas.style.width = targetW + "px";
          canvas.style.height = targetH + "px";
        }
        if (host) {
          host.style.width = targetW + "px";
          host.style.height = targetH + "px";
        }
      };
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      const b64 = "${b64}";
      const decodeBase64 = (b64Text) => {
        const binary = atob(b64Text);
        if (window.TextDecoder) {
          const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
          return new TextDecoder().decode(bytes);
        }
        return decodeURIComponent(escape(binary));
      };
      const code = decodeBase64(b64);
      const input = document.getElementById("programInput");
      const run = document.getElementById("runBtn");
      input.value = code.replace(/\\r\\n/g, "\\n");
      setTimeout(() => run.click(), 0);
    })();
  </script>
</body>
</html>`;
  const compactHtml = runnerHtml.replace(/\r?\n/g, "");

      const saveAsFile = async () => {
        if (window.showSaveFilePicker && window.isSecureContext) {
          const handle = await window.showSaveFilePicker({
            suggestedName: "gamebasic-runner.html",
            types: [
              {
                description: "HTML",
                accept: { "text/html": [".html"] }
              }
            ]
          });
          const writable = await handle.createWritable();
          await writable.write(compactHtml);
          await writable.close();
          return;
        }
        const blob = new Blob([compactHtml], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "gamebasic-runner.html";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      };

      try {
        await saveAsFile();
      } catch (err) {
        console.error(err);
      }
    });
  }
  spriteEditorBtn.addEventListener("click", openSpriteEditor);
  spriteEditorClose.addEventListener("click", closeSpriteEditor);
  spriteEditorModal.addEventListener("click", (event) => {
    if (event.target === spriteEditorModal) {
      closeSpriteEditor();
    }
  });
  spriteLoadBtn.addEventListener("click", () => {
    spriteFileInput.value = "";
    spriteFileInput.click();
  });
  spriteSaveBtn.addEventListener("click", async () => {
    const dataUrl = spriteEditorCanvas.toDataURL("image/png");
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: "sprite-sheet.png",
          types: [
            {
              description: "PNG Image",
              accept: { "image/png": [".png"] }
            }
          ]
        });
        const writable = await handle.createWritable();
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (error) {
        if (error && error.name === "AbortError") {
          return;
        }
      }
    }
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "sprite-sheet.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
  spriteUndoBtn.addEventListener("click", undoSprite);
  spriteRedoBtn.addEventListener("click", redoSprite);
  spriteResizeBtn.addEventListener("click", () => {
    pushSpriteHistory();
    const width = parsePositiveInt(spriteWidthInput.value, spriteEditorCanvas.width);
    const height = parsePositiveInt(spriteHeightInput.value, spriteEditorCanvas.height);
    resizeSpriteCanvas(width, height, true);
  });
  spriteToolBrush.addEventListener("click", () => setSpriteTool("brush"));
  spriteToolFill.addEventListener("click", () => setSpriteTool("fill"));
  spriteFrameWInput.addEventListener("input", updateSpriteGrid);
  spriteFrameHInput.addEventListener("input", updateSpriteGrid);
  spriteGridToggle.addEventListener("change", updateSpriteGrid);
  spriteCopyBtn.addEventListener("click", async () => {
    const text = spriteEditorCanvas.toDataURL("image/png");
    spriteDataUrl.value = text;
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      spriteDataUrl.focus();
      spriteDataUrl.select();
      document.execCommand?.("copy");
    }
  });
  spriteFileInput.addEventListener("change", () => {
    const file = spriteFileInput.files && spriteFileInput.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        pushSpriteHistory();
        spriteWidthInput.value = String(img.width);
        spriteHeightInput.value = String(img.height);
        resizeSpriteCanvas(img.width, img.height, false);
        spriteCtx.clearRect(0, 0, spriteEditorCanvas.width, spriteEditorCanvas.height);
        spriteCtx.drawImage(img, 0, 0);
        scheduleSpriteDataUrlUpdate();
      };
      img.src = String(reader.result ?? "");
    };
    reader.readAsDataURL(file);
  });
  spriteEditorCanvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  spriteEditorCanvas.addEventListener("pointerdown", (event) => {
    spriteDrawing = true;
    spriteDrawButton = event.button;
    spriteEditorCanvas.setPointerCapture(event.pointerId);
    const { x, y } = getSpritePointerPosition(event);
    if (spriteTool === "fill") {
      spriteDrawing = false;
      spriteEditorCanvas.releasePointerCapture(event.pointerId);
      pushSpriteHistory();
      floodFillSprite(x, y, spriteDrawButton);
      return;
    }
    pushSpriteHistory();
    applySpriteBrush(x, y, spriteDrawButton);
  });
  spriteEditorCanvas.addEventListener("pointermove", (event) => {
    if (!spriteDrawing) {
      return;
    }
    const { x, y } = getSpritePointerPosition(event);
    applySpriteBrush(x, y, spriteDrawButton);
  });
  spriteEditorCanvas.addEventListener("pointerup", (event) => {
    spriteDrawing = false;
    spriteEditorCanvas.releasePointerCapture(event.pointerId);
  });
  spriteEditorCanvas.addEventListener("pointercancel", () => {
    spriteDrawing = false;
  });
  spriteEditorCanvas.addEventListener("pointerleave", () => {
    spriteDrawing = false;
  });
  programInput.addEventListener("input", syncHighlight);
  programInput.addEventListener("input", syncLineNumbers);
  programInput.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") {
      return;
    }
    event.preventDefault();
    const tab = "\t";
    const value = programInput.value;
    const start = programInput.selectionStart ?? 0;
    const end = programInput.selectionEnd ?? 0;

    if (start === end) {
      programInput.value = value.slice(0, start) + tab + value.slice(end);
      programInput.selectionStart = start + tab.length;
      programInput.selectionEnd = start + tab.length;
    } else {
      const before = value.slice(0, start);
      const selected = value.slice(start, end);
      const after = value.slice(end);
      const lines = selected.split("\n");

      if (event.shiftKey) {
        let removed = 0;
        const newLines = lines.map((line) => {
          if (line.startsWith("\t")) {
            removed += 1;
            return line.slice(1);
          }
          if (line.startsWith("  ")) {
            removed += 2;
            return line.slice(2);
          }
          if (line.startsWith(" ")) {
            removed += 1;
            return line.slice(1);
          }
          return line;
        });
        programInput.value = before + newLines.join("\n") + after;
        programInput.selectionStart = start;
        programInput.selectionEnd = Math.max(start, end - removed);
      } else {
        const newLines = lines.map((line) => tab + line);
        programInput.value = before + newLines.join("\n") + after;
        programInput.selectionStart = start;
        programInput.selectionEnd = end + tab.length * lines.length;
      }
    }

    syncHighlight();
    syncLineNumbers();
  });
  programInput.addEventListener("scroll", () => {
    highlight.scrollTop = programInput.scrollTop;
    highlight.scrollLeft = programInput.scrollLeft;
    lineNumbers.scrollTop = programInput.scrollTop;
  });
  window.addEventListener("resize", () => {
    syncLineNumbers();
    updateSpriteCanvasDisplaySize();
  });
  syncHighlight();
  syncLineNumbers();
  setSpriteTool("brush");
  updateSpriteHistoryButtons();
  resizeSpriteCanvas(
    parsePositiveInt(spriteWidthInput.value, spriteEditorCanvas.width),
    parsePositiveInt(spriteHeightInput.value, spriteEditorCanvas.height),
    true
  );
  const preferSmallScreen = window.matchMedia && window.matchMedia("(max-width: 768px), (max-height: 500px)").matches;
  if (preferSmallScreen) {
    screenSize.value = "1x";
  }
  applyScreenSize(screenSize.value);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncLineNumbers);
  }
})();
