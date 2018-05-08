/** Class representing a menu. */
class Menu {
    /**
     * Creates all the variables and then constructs the menu.
     * @param {Object} canvas - The canvas that we are using.
     */
    constructor(canvas) {
        this.homePage = loadImage("images/home_menu.png");
        this.buttonPlay = loadImage("images/PlayButton.png");
        this.buttonExit = loadImage("images/ExitButton.png");
    }

    /**
     * Draws the background and the two buttons.
     */
    draw() {
        background(this.homePage);
        image(this.buttonPlay, 950, 520, 170, 118);
        image(this.buttonExit, 150, 520, 170, 118);
    }

    /**
     * Checks for mouse clicks on the buttons.
     */
    mouseReleased() {
        if (mouseX <= 1120 && mouseX >= 950 && mouseY <= 638 && mouseY >= 520) {
            gameState = LEVEL_0;
            bgnMusicSFX.stop();
            lvlStartSFX.play();
        } else if (mouseX <= 320 && mouseX >= 150 && mouseY <= 638 && mouseY >= 520) {
            gameState = END_GAME;
        }

    }
}