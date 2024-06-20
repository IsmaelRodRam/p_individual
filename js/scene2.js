import { game as gController } from "./memorymodo2.js";

export class PlayScene extends Phaser.Scene{
    constructor (){
        super('PlayScene');
        this.resources = [];
        this.cards = gController.init(()=>null); // Inicialitzar cartes
    }

    preload() {  
        this.cards.forEach((r)=>{
            if (!this.resources.includes(r.front))
                this.resources.push(r.front);
        });
        this.resources.push("../resources/back.png");
        this.resources.forEach((r)=>this.load.image(r,r)); // Primer paràmetre nom Segon paràmetre direcció

    }

    create() {
        this.cameras.main.setBackgroundColor(0xBFFCFF);

        this.g_cards = this.physics.add.staticGroup();
    
        const cardWidth = 100;
        const cardHeight = 100;
        const cardSpacing = 30;
        const cardsPerRow = 4;
        const numRows = Math.ceil(this.cards.length / cardsPerRow);
  
    
        const totalWidth = cardsPerRow * (cardWidth + cardSpacing) - cardSpacing; 
        const totalHeight = numRows * (cardHeight + cardSpacing) - cardSpacing;
  
      
        const startX = (this.cameras.main.width - totalWidth) / 2;
        const startY = (this.cameras.main.height - totalHeight) / 2;
  
        this.cards.forEach((c, i) => {
         
             let x = startX + (i % cardsPerRow) * (cardWidth + cardSpacing);
          
            let y = startY + Math.floor(i / cardsPerRow) * (cardHeight + cardSpacing);
  
            this.g_cards.create(x, y, c.current);
        });

        const buttonWidth = 300;
        const buttonHeight = 80;
        const buttonX = (this.cameras.main.width - buttonWidth) / 2;
        const buttonY = this.cameras.main.height - buttonHeight - 20;

        const buttonGraphics = this.add.graphics();
        const buttonColor = 0xff6570;
        buttonGraphics.fillStyle(buttonColor, 1);
        buttonGraphics.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

        const buttonText = this.add.text(buttonX + buttonWidth / 2, buttonY + buttonHeight / 2, 'GUARDAR', { fill: '#fff', fontSize: '30px' });
        buttonText.setOrigin(0.5);

        const buttonZone = this.add.zone(buttonX + buttonWidth / 2, buttonY + buttonHeight / 2, buttonWidth, buttonHeight);
        buttonZone.setOrigin(0.5);
        buttonZone.setInteractive({ useHandCursor: true });

        const saveButton = this.add.container(0, 0, [buttonGraphics, buttonText, buttonZone]);

        buttonZone.on('pointerdown', function (pointer) {
            gController.save();
        });

        buttonZone.on('pointerover', function () {
            buttonGraphics.clear();
            buttonGraphics.fillStyle(0xff8590, 1);
            buttonGraphics.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        });

        buttonZone.on('pointerout', function () {
            buttonGraphics.clear();
            buttonGraphics.fillStyle(buttonColor, 1);
            buttonGraphics.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        });

        this.g_cards.children.iterate((c, i) => {
            c.setInteractive();
            c.on('pointerup', () => gController.click(this.cards[i]));
        });





        this.g_cards.children.iterate((c, i) => {
            c.setInteractive();
            c.on('pointerup', ()=> gController.click(this.cards[i]));
        });
    }

    update() {
        this.g_cards.children.iterate((c, i) => c.setTexture(this.cards[i].current));
    }
}