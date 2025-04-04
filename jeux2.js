
let niveau = 1;

function afficherNiveau() {
  document.getElementById("niveau").textContent = niveau;
}
document.addEventListener("DOMContentLoaded", () => {

afficherNiveau();
    const grid = document.querySelector(".grid");
    const message = document.getElementById("message");
    const restartBtn = document.getElementById("restart");
    let flippedCards = [];
    let matchedPairs = 0;
    let isProcessing = false;

    // 🎵 Charger les sons
    const flipSound = document.getElementById("flipSound");
    const matchSound = document.getElementById("matchSound");

    // ✅ Liste des images (Assure-toi qu'elles sont bien dans ton projet)
const animalImages = [
  "chien.png", "chien2.png",
  "dog.png", "dog2.png",
  "tiger.png", "tiger2.png",
  "cat.jpg", "cat2.jpg",
  "lion.jpg", "lion2.jpg",
  "elephant.jpg", "elephant2.jpg",
  "panda.jpg", "panda2.jpg",
  "Girafe.jpg", "Girafe2.jpg",
  "singe.jpg", "singe2.jpg"
];

    

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createBoard() {
if (niveau > 3) {
  message.textContent = "Félicitations ! Tu as terminé tous les niveaux !";
  return;
}
        grid.innerHTML = "";
        const gameImages =            getCartesPourNiveau(niveau);
        shuffle(gameImages);
        flippedCards = [];
        matchedPairs = 0;
        isProcessing = false;

        gameImages.forEach((imageSrc) => {
            const card = document.createElement("div");
card.classList.add("card");
card.dataset.animal = imageSrc;

const cardInner = document.createElement("div");
cardInner.classList.add("card-inner");

const cardFront = document.createElement("div");
cardFront.classList.add("card-front");

const cardBack = document.createElement("div");
cardBack.classList.add("card-back");

const img = document.createElement("img");
img.src = imageSrc;
img.alt = "Animal";

img.onerror = () => {
    console.error(`❌ Erreur : L'image ${imageSrc} ne s'est pas chargée.`);
    img.src = "placeholder.png"; 
};

cardBack.appendChild(img);
cardInner.appendChild(cardFront);
cardInner.appendChild(cardBack);
card.appendChild(cardInner);
grid.appendChild(card);

card.addEventListener("click", flipCard);

        message.textContent = "Regarde bien les cartes ! Elles vont se retourner après 5 secondes.";

        setTimeout(() => {
            document.querySelectorAll(".card img").forEach(img => {
                img.classList.remove("show");
                img.classList.add("hide");
            });
            message.textContent = "Trouve les paires !";
        }, 5000);
    }

    function flipCard() {
        if (isProcessing || this.classList.contains("flipped") || this.classList.contains("matched")) return;

        this.classList.toggle("flipped");
        
        flipSound.play(); 
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }

    function checkMatch() {
        isProcessing = true;
        let [card1, card2] = flippedCards;

        let animal1 = card1.dataset.animal.replace(/[0-9]/g, "").split(".")[0];
        let animal2 = card2.dataset.animal.replace(/[0-9]/g, "").split(".")[0];

        if (animal1 === animal2) {
            card1.classList.add("matched");
            card2.classList.add("matched");

            matchSound.play();
            createFireworksEffect(card1, card2); // 🎇 Effet d'explosion sur les cartes

            matchedPairs++;

            if (matchedPairs === getCartesPourNiveau(niveau).length / 2) {
    niveau++;
    afficherNiveau();
    message.textContent = "Bravo ! Tu passes au niveau " + niveau;
    setTimeout(() => {
        createBoard();
    }, 3000);
}
            flippedCards = [];
            isProcessing = false;
        } else {
            setTimeout(() => {
                card1.classList.remove("flipped");
                card2.classList.remove("flipped");
                card1.querySelector("img").classList.add("hide");
                card2.querySelector("img").classList.add("hide");
                flippedCards = [];
                isProcessing = false;
            }, 1000);
        }
    }

  function getCartesPourNiveau(niveau) {
  const pairesParNiveau = {
    1: 4,  // 8 cartes
    2: 6,  // 12 cartes
    3: 9   // 18 cartes
  };

  const nombreDePaires = pairesParNiveau[niveau] || 4;

  const cartes = animalImages.slice(0, nombreDePaires * 2);
  return cartes;
  }

    function createFireworksEffect(card1, card2) {
        for (let i = 0; i < 5; i++) { 
            setTimeout(() => {
                const explosion = document.createElement("div");
                explosion.classList.add("firework-effect");

                let rect = card1.getBoundingClientRect();
                explosion.style.left = `${rect.left + rect.width / 2}px`;
                explosion.style.top = `${rect.top + rect.height / 2}px`;

                document.body.appendChild(explosion);

                setTimeout(() => {
                    explosion.remove();
                }, 1000);
            }, i * 100);
        }
    }



    restartBtn.addEventListener("click", () => {
        createBoard();
    });

    createBoard();
});


