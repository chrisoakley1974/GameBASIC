# BasicEngine

A tiny BASIC-style interpreter in the browser with sprite support.

## Run
Open [index.html](index.html) in a browser.

## Example
```
REM 3-ball collision + starfield demo
CLS()
CLEARSCREEN()
SPRITE("BALLA", 8, 8, "#ff6b6b")
SPRITE("BALLB", 8, 8, "#4cc2ff")
SPRITE("BALLC", 8, 8, "#ffd166")
SPRITE("STAR", 1, 1, "#ffffff")

LET COUNT = 80
LET SPEED = 2
LET DEPTH = 255
LET SCX = 160
LET SCY = 100
LET STARBANK = 1

BANKCREATE(STARBANK, COUNT * 3)

LET I = 0
WHILE I < COUNT
	LET TX = INT(RND() * 256)
	LET TY = INT(RND() * 256)
	LET TZ = INT(RND() * DEPTH) + 1
	BANKPOKE(STARBANK, I * 3, TX)
	BANKPOKE(STARBANK, I * 3 + 1, TY)
	BANKPOKE(STARBANK, I * 3 + 2, TZ)
	LET I = I + 1
ENDWHILE

LET AX = 10
LET AY = 10
LET AVX = 2
LET AVY = 1

LET BX = 200
LET BY = 40
LET BVX = -2
LET BVY = 1

LET CX = 120
LET CY = 160
LET CVX = 1
LET CVY = -2

LET BOUNCE = 0
LET TIMER = 0
LET STEP = 0

DATA TUNE, 0, 0, 0.18, 4, -12, 0.08, 0, 4, 0.16, 0, 7, 0.16, 4, -2, 0.08, 0, 12, 0.16
RESTORE TUNE

WHILE 1
	CLEARSCREEN()
	LET I = 0
	WHILE I < COUNT
		LET TX = BANKPEEK(STARBANK, I * 3) - 128
		LET TY = BANKPEEK(STARBANK, I * 3 + 1) - 128
		LET TZ = BANKPEEK(STARBANK, I * 3 + 2)
		LET TZ = TZ - SPEED
		IF TZ <= 1 THEN
			LET TZ = DEPTH
			LET TX = INT(RND() * 256) - 128
			LET TY = INT(RND() * 256) - 128
		ENDIF

		LET SCALE = 64 / TZ
		LET SX = INT(SCX + TX * SCALE)
		LET SY = INT(SCY + TY * SCALE)
		IF SX >= 0 THEN
			IF SX < 320 THEN
				IF SY >= 0 THEN
					IF SY < 200 THEN
						DRAWSPRITE("STAR", SX, SY)
					ENDIF
				ENDIF
			ENDIF
		ENDIF

		BANKPOKE(STARBANK, I * 3, TX + 128)
		BANKPOKE(STARBANK, I * 3 + 1, TY + 128)
		BANKPOKE(STARBANK, I * 3 + 2, TZ)
		LET I = I + 1
	ENDWHILE

	DRAWSPRITE("BALLA", AX, AY)
	DRAWSPRITE("BALLB", BX, BY)
	DRAWSPRITE("BALLC", CX, CY)
	TEXTCENTER("Bounced " + BOUNCE)
	FLIP()

	LET TIMER = TIMER + 1
	IF TIMER >= 8 THEN
		LET TIMER = 0
		READ W, N, D
		SOUND(W, N, D)
		LET STEP = STEP + 1
		IF STEP >= 6 THEN
			LET STEP = 0
			RESTORE TUNE
		ENDIF
	ENDIF

	LET AX = AX + AVX
	LET AY = AY + AVY
	LET BX = BX + BVX
	LET BY = BY + BVY
	LET CX = CX + CVX
	LET CY = CY + CVY

	IF AX <= 0 THEN
		LET AVX = 2
		LET BOUNCE = BOUNCE + 1
	ENDIF
	IF AX >= 312 THEN
		LET AVX = -2
		LET BOUNCE = BOUNCE + 1
	ENDIF
	IF AY <= 0 THEN
		LET AVY = 1
		LET BOUNCE = BOUNCE + 1
	ENDIF
	IF AY >= 192 THEN
		LET AVY = -1
		LET BOUNCE = BOUNCE + 1
	ENDIF

	IF BX <= 0 THEN
		LET BVX = 2
		LET BOUNCE = BOUNCE + 1
	ENDIF
	IF BX >= 312 THEN
		LET BVX = -2
		LET BOUNCE = BOUNCE + 1
	ENDIF
	IF BY <= 0 THEN
		LET BVY = 1
		LET BOUNCE = BOUNCE + 1
	ENDIF
	IF BY >= 192 THEN
		LET BVY = -1
		LET BOUNCE = BOUNCE + 1
	ENDIF

	IF CX <= 0 THEN
		LET CVX = 1
		LET BOUNCE = BOUNCE + 1
	ENDIF
	IF CX >= 312 THEN
		LET CVX = -1
		LET BOUNCE = BOUNCE + 1
	ENDIF
	IF CY <= 0 THEN
		LET CVY = 2
		LET BOUNCE = BOUNCE + 1
	ENDIF
	IF CY >= 192 THEN
		LET CVY = -2
		LET BOUNCE = BOUNCE + 1
	ENDIF

	IF COLLIDES("BALLA", AX, AY, "BALLB", BX, BY) THEN
		LET TVX = AVX
		LET TVY = AVY
		LET AVX = BVX
		LET AVY = BVY
		LET BVX = TVX
		LET BVY = TVY
	ENDIF
	IF COLLIDES("BALLA", AX, AY, "BALLC", CX, CY) THEN
		LET TVX = AVX
		LET TVY = AVY
		LET AVX = CVX
		LET AVY = CVY
		LET CVX = TVX
		LET CVY = TVY
	ENDIF
	IF COLLIDES("BALLB", BX, BY, "BALLC", CX, CY) THEN
		LET TVX = BVX
		LET TVY = BVY
		LET BVX = CVX
		LET BVY = CVY
		LET CVX = TVX
		LET CVY = TVY
	ENDIF
ENDWHILE
END
```

## Statements
- `REM` comment
- `LET name = expr` or `name = expr`
- `DATA id, ...` define inline data items
- `READ var1, var2` read from DATA
- `RESTORE [id]` reset READ pointer (defaults to start)
- `IF <expr> THEN` ... `ENDIF`
- `WHILE <expr>` ... `ENDWHILE`
- `FUNC name(param1, param2)` ... `END`
- `RETURN <expr>`
- `END` stop execution

## Built-in Functions
- `PRINT(...)` print values
- `TEXT(x, y, text)` draw text at position
- `TEXTCENTER(text)` draw centered text
- `INPUT(prompt)` returns a value
- `CLS()` clear output
- `CLEARSCREEN()` clear canvas
- `SPRITE(name, w, h, "#RRGGBB")`
- `SPRITE(name, "image-url")`
- `DRAWSPRITE(name, x, y)`
- `MOVESPRITE(name, x, y)`
- `COLLIDES(nameA, xA, yA, nameB, xB, yB)` returns 1 when overlapping
- `FLIP()` render the current frame to the screen
- `SOUND(wave, note, seconds)` play a note (wave: 0=sine, 1=saw, 2=square, 4=whitenoise or string) where note 0 is middle C; for noise the note sets the filter pitch
- `RND(max)` random float (default 0..1)
- `INT(value)` floor to integer
- `BANKCREATE(id, size)` allocate a bank
- `BANKLOAD(id, data)` load hex or base64 data into a bank
- `BANKFREE(id)` free a bank
- `BANKCOPY(src, dst)` copy a bank
- `BANKPEEK(id, index)` read byte from bank
- `BANKPOKE(id, index, value)` write byte to bank
- `SETFONT(id)` use a font bank (requires 1024 bytes: 128 chars x 8 rows)
- `KEYDOWN(code)` returns 1 if a key is down (e.g., "ArrowLeft", "Space")
- `LASTKEY()` returns last key pressed
- `STRLEN(text)` returns string length

### BANKLOAD data formats
- Hex string: `BANKLOAD(1, "00 FF 1A ...")`
- Base64 string: `BANKLOAD(1, "BASE64:AAECAwQ=")`
