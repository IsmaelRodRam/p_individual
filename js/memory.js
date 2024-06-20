export var game = function(){
    var points;
    var timeout;
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
        goBack: function (){
            setTimeout(() => {
                this.current = back;
                this.clickable = true;
                this.callback();
            }, timeout);
        },
        goFront: function (last){
            if (last) {
                this.waiting = last.waiting = false;
            } else {
                this.waiting = true;
            }
            this.current = this.front;
            this.clickable = false;
            this.callback();
        },
        check: function (other){
            if (this.front === other.front) {
                this.isDone = other.isDone = true;
            }
            return this.isDone;
        }
    };

    const default_options = {
        pairs: 2,
        difficulty: 'normal'
    };
    var options = JSON.parse(localStorage.options || JSON.stringify(default_options));

    var lastCard;
    var pairs = options.pairs;
    var totalPoints = 100;
    var difficulty = options.difficulty;
    var cards = [];

    console.log(difficulty);

    switch (difficulty) {
        case 'easy':
            timeout = 2500;
            points = 20;
            break;
        case 'normal':
            timeout = 1500;
            points = 25;
            break;
        case 'hard':
            timeout = 700;
            points = 50;
            break;
    }

    var mix = function() {
        console.log(pairs);
        var items = resources.slice();
        items.sort(() => Math.random() - 0.5);
        items = items.slice(0, pairs);
        items = items.concat(items);
        return items.sort(() => Math.random() - 0.5);
    }

    return {
        init: function (call) {
            if (sessionStorage.save) {
                let partida = JSON.parse(sessionStorage.save);
                pairs = partida.pairs;
                totalPoints = partida.points;
                partida.cards.forEach(item => {
                    let it = Object.create(card);
                    it.front = item.front;
                    it.current = item.current;
                    it.isDone = item.isDone;
                    it.waiting = item.waiting;
                    it.callback = call;
                    cards.push(it);
                    if (it.current != back && !it.waiting && !it.isDone) it.goBack();
                    else if (it.waiting) lastCard = it;
                });
                return cards;
            } else {
                return mix().map(item => {
                    cards.push(Object.create(card, {
                        front: { value: item },
                        callback: { value: call }
                    }));
                    cards.forEach(c => {
                        c.current = c.front;
                        c.clickable = false;
                        setTimeout(() => {
                            c.current = back;
                            c.clickable = true;
                            c.callback();
                        }, timeout);
                    });
                    return cards[cards.length - 1];
                });
            }
        },

        click: function (card) {
            if (!card.clickable) return;
            card.goFront(lastCard);
            if (lastCard) {
                if (card.check(lastCard)) {
                    pairs--;
                    if (pairs <= 0) {
                        alert("HAS GANADO CON " + totalPoints + " PUNTOS!!");
                        window.location.replace("../");
                    }
                } else {
                    [card, lastCard].forEach(c => c.goBack());
                    totalPoints -= points;
                    if (totalPoints <= 0) {
                        alert("HAS PERDIDO");
                        window.location.replace("../");
                    }
                }
                lastCard = null;
            } else {
                lastCard = card;
            }
        },

        save: function () {
            var partida = {
                uuid: localStorage.uuid,
                pairs: pairs,
                points: totalPoints,
                cards: []
            };
            cards.forEach(c => {
                partida.cards.push({
                    current: c.current,
                    front: c.front,
                    isDone: c.isDone,
                    waiting: c.waiting
                });
            });

            let json_partida = JSON.stringify(partida);

            fetch("../php/save.php", {
                method: "POST",
                body: json_partida,
                headers: { "content-type": "application/json; charset=UTF-8" }
            })
            .then(response => response.json())
            .then(json => {
                console.log(json);
            })
            .catch(err => {
                console.log(err);
                localStorage.save = json_partida;
                console.log(localStorage.save);
            })
            .finally(() => {
                window.location.replace("../");
            });
        }
    }
}();
