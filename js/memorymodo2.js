export var game = function() {
    const back = '../resources/back.png';
    const resources = [
        '../resources/cb.png', '../resources/co.png', '../resources/sb.png',
        '../resources/so.png', '../resources/tb.png', '../resources/to.png'
    ];

    const card = {
        current: back,
        clickable: true,
        waiting: false,
        isDone: false,
        goBack: function() {
            setTimeout(() => {
                this.current = back;
                this.clickable = true;
                this.callback();
            }, this.temps);
        },
        goFront: function(last) {
            this.waiting = last ? last.waiting = false : true;
            this.current = this.front;
            this.clickable = false;
            this.callback();
        },
        check: function(other) {
            if (this.front === other.front) {
                this.isDone = other.isDone = true;
            }
            return this.isDone;
        }
    };

    const defaultOptions = {
        nivel: 1,
        difficulty: 'normal'
    };

    const options = JSON.parse(localStorage.options2 || JSON.stringify(defaultOptions));
    let lastCard;
    let nivel = Math.max(1, Math.min(6, parseInt(sessionStorage.getItem('nivel')) || options.nivel));
    let pairs;
    let points = 100;
    const difficulty = options.difficulty;
    const cards = [];
    let temps = 1000;  // Default temp value for card reveal
    let punts = 10;    // Points deduction for a wrong pair

    const mix = function() {
        let items = resources.slice(0, nivel);
        items = items.concat(items); // Duplicate items to ensure pairs
        return items.sort(() => Math.random() - 0.5);
    };

    return {
        init: function(call) {
            if (sessionStorage.save) {
                let savedGame = JSON.parse(sessionStorage.save);
                pairs = savedGame.pairs;
                points = savedGame.points;
                cards.push(...savedGame.cards.map(item => {
                    let it = Object.create(card);
                    it.front = item.front;
                    it.current = item.current;
                    it.isDone = item.isDone;
                    it.waiting = item.waiting;
                    it.callback = call;
                    it.temps = temps;
                    return it;
                }));
                return cards;
            } else {
                pairs = nivel;  // Set pairs based on level
                mix().forEach(item => {
                    let newCard = Object.create(card, {
                        front: { value: item },
                        callback: { value: call },
                        temps: { value: temps }
                    });
                    cards.push(newCard);
                    setTimeout(() => {
                        newCard.current = back;
                        newCard.clickable = true;
                        newCard.callback();
                    }, temps);
                });
                return cards;
            }
        },
        click: function(card) {
            if (!card.clickable) return;
            card.goFront(lastCard);
            if (lastCard) {
                if (card.check(lastCard)) {
                    pairs--;
                    if (pairs <= 0) {
                        alert(`¡HAS GANADO CON ${points} PUNTOS!`);
                        nivel = Math.min(6, nivel + 1);  // Incrementar el nivel, pero no superar 6
                        sessionStorage.setItem('nivel', nivel);
                        setTimeout(() => location.reload(), 100);
                    }
                } else {
                    [card, lastCard].forEach(c => c.goBack());
                    points -= punts;
                    if (points <= 0) {
                        alert("¡HAS PERDIDO!");
                        window.location.replace("../");
                    }
                }
                lastCard = null;
            } else {
                lastCard = card;
            }
        },
        save: function() {
            const partida = {
                uuid: localStorage.uuid,
                pairs: pairs,
                points: points,
                cards: cards.map(c => ({
                    current: c.current,
                    front: c.front,
                    isDone: c.isDone,
                    waiting: c.waiting
                }))
            };
            fetch("../php/save.php", {
                method: "POST",
                body: JSON.stringify(partida),
                headers: { "content-type": "application/json; charset=UTF-8" }
            })
            .then(response => response.json())
            .then(json => console.log(json))
            .catch(err => {
                console.log(err);
                localStorage.save = JSON.stringify(partida);
                console.log(localStorage.save);
            })
            .finally(() => window.location.replace("../"));
        }
    };
}();

