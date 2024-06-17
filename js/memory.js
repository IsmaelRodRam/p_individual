export var game = function() {
    const back = '../resources/back.png';
    const resources = [
        '../resources/cb.png', '../resources/co.png',
        '../resources/sb.png', '../resources/so.png',
        '../resources/tb.png', '../resources/to.png'
    ];
    const card = {
        current: back,
        clickable: true,
        goBack: function() {
            setTimeout(() => {
                this.current = back;
                this.clickable = true;
                this.callback();
            }, 1000);
        },
        goFront: function() {
            this.current = this.front;
            this.clickable = false;
            this.callback();
        }
    };
    
    var options = JSON.parse(localStorage.getItem("options") || JSON.stringify(default_options));
    var lastCard;
    var pairs = options.pairs;
    var difficulty = options.difficulty;
    var points = 100;

    return {
        init: function(call) {
            var shuffledResources = resources.slice().sort(() => Math.random() - 0.5);
            var selectedResources = shuffledResources.slice(0, pairs).concat(shuffledResources.slice(0, pairs));
            selectedResources.sort(() => Math.random() - 0.5);
        
            var cards = selectedResources.map(item => {
                var newCard = Object.create(card);
                newCard.front = item;
                newCard.callback = call;
                return newCard;
            });
        
            var revealTime;
            switch (difficulty) {
                case "easy":
                    revealTime = 3000;
                    break;
                case "normal":
                    revealTime = 2000;
                    break;
                default:
                    revealTime = 1000;
                    break;
            }
        
            cards.forEach(card => {
                card.current = card.front;
                card.clickable = false;
            });
        
            setTimeout(() => {
                cards.forEach(card => {
                    card.current = back;
                    card.clickable = true;
                    card.callback();
                });
            }, revealTime);
        
            return cards;
        },
        click: function(card) {
            if (!card.clickable) return;
            card.goFront();
            if (lastCard) {
                if (card.front === lastCard.front) {
                    pairs--;
                    if (pairs <= 0) {
                        alert("HAS GANADO CON " + points + " PUNTOS!");
                        window.location.replace("../");
                    }
                } else {
                    [card, lastCard].forEach(c => c.goBack());
                    if (difficulty === "easy") {
                        points -= 15;
                    } else if (difficulty === "normal") {
                        points -= 25;
                    } else {
                        points -= 50;
                    }
                    if (points <= 0) {
                        alert("HAS PERDIDO!!");
                        window.location.replace("../");
                    }
                }
                lastCard = null;
            } else {
                lastCard = card;
            }
        }
    };
}();
