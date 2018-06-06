/** Class representing a menu. */
class Menu {
    /**
     * Creates all the variables and then constructs the menu.
     * @param {Object} canvas - The canvas that we are using.
     */
    constructor(canvas) {
        this.homePage = loadImage("images/home_menu.png");
        this.buttonPlay = loadImage("images/PlayButtonHiRes.png");
        this.buttonExit = loadImage("images/ExitButton.png");

        this.playXpos = width - 300;
        this.playYpos = height - 200;
        this.exitXpos = width / 4 - 200;
        this.buttonWidth = 170;
        this.buttonHeight = 118;
    }

    /**
     * Draws the background and the two buttons.
     */
    draw() {
        background(this.homePage);
        image(this.buttonPlay, this.playXpos, this.playYpos, this.buttonWidth, this.buttonHeight);
        image(this.buttonExit, this.exitXpos, this.playYpos, this.buttonWidth, this.buttonHeight);
    }

    /**
     * Checks for mouse clicks on the buttons.
     */
    mouseReleased() {
        if (mouseX <= this.playXpos + this.buttonWidth && mouseX >= this.playXpos && mouseY <= this.playYpos + this.buttonHeight && mouseY >= this.playYpos) {
            gameState = LEVEL_0;
            farmSFX.loop();
            bgnMusicSFX.stop();
            lvlStartSFX.play();
        } else if (mouseX <= this.exitXpos + this.buttonWidth && mouseX >= this.exitXpos && mouseY <= this.playYpos + this.buttonHeight && mouseY >= this.playYpos) {
            gameState = END_GAME;
        }
    }
}