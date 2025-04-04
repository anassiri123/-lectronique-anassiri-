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

  const flipSound = document.getElementById("flipSound");
  const matchSound = document.getElementById("matchSound");

  const animalImages = [
    "chien.png", "chien2.png", "dog.png", "dog2.png",
    "tiger.png", "tiger2.png", "cat.jpg", "cat2.jpg",
    "lion.jpg", "lion2.jpg", "elephant.jpg", "elephant2.jpg",
    "panda.jpg", "panda2.jpg", "Girafe.jpg", "Girafe2.jpg",
    "singe.jpg", "singe2.jpg"
  ];

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function getCartesPourNiveau(niveau) {
    const pairesParNiveau = { 1: 4, 2: 6, 3: 9 };
    const nombreDePaires = pairesParNiveau[niveau] || 4;
    return animalImages.slice(0, nombreDePaires * 2);
  }

  function createBoard() {
    if (niveau > 3) {
  message.textContent = "Félicitations ! Tu as terminé tous les niveaux !";

  // Personnaliser le bouton Rejouer
  restartBtn.textContent = "😊 Rejouer";
  restartBtn.style.backgroundColor = "#28a745"; // vert
  restartBtn.style.color = "white";
  restartBtn.style.border = "none";
  restartBtn.style.transition = "0.3s";
  restartBtn.style.transform = "scale(1.1)";
  restartBtn.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
  return;
}

    grid.innerHTML = "";
    const gameImages = getCartesPourNiveau(niveau);
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
    });

    message.textContent = "Regarde bien ! Les cartes vont se retourner après 5 secondes.";

    setTimeout(() => {
      document.querySelectorAll(".card").forEach(card => {
        card.classList.remove("flipped");
      });
      message.textContent = "Trouve les paires !";
    }, 5000);
  }

  function flipCard() {
    if (isProcessing || this.classList.contains("flipped") || this.classList.contains("matched")) return;

    this.classList.add("flipped");
    flipSound.play();
    flippedCards.push(this);

    if (flippedCards.length === 2) checkMatch();
  }

  function checkMatch() {
    isProcessing = true;
    const [card1, card2] = flippedCards;

    const animal1 = card1.dataset.animal.replace(/[0-9]/g, "").split(".")[0];
    const animal2 = card2.dataset.animal.replace(/[0-9]/g, "").split(".")[0];

    if (animal1 === animal2) {
      card1.classList.add("matched");
      card2.classList.add("matched");
      matchSound.play();
      createFireworksEffect(card1, card2);
      matchedPairs++;

      if (matchedPairs === getCartesPourNiveau(niveau).length / 2) {
        niveau++;
        afficherNiveau();
        message.textContent = "Bravo ! Tu passes au niveau " + niveau;
        setTimeout(createBoard, 3000);
      }

      flippedCards = [];
      isProcessing = false;
    } else {
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        flippedCards = [];
        isProcessing = false;
      }, 1000);
    }
  }

  function createFireworksEffect(card1, card2) {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const explosion = document.createElement("div");
        explosion.classList.add("firework-effect");

        const rect = card1.getBoundingClientRect();
        explosion.style.left = `${rect.left + rect.width / 2}px`;
        explosion.style.top = `${rect.top + rect.height / 2}px`;

        document.body.appendChild(explosion);
        setTimeout(() => explosion.remove(), 1000);
      }, i * 100);
    }
  }

  restartBtn.addEventListener("click", () => {
  niveau = 1;
  afficherNiveau();
  
  // Réinitialiser le style et texte du bouton
  restartBtn.textContent = "Rejouer";
  restartBtn.style.backgroundColor = "#007bff"; // couleur d'origine
  restartBtn.style.color = "white";
  restartBtn.style.transform = "scale(1)";
  restartBtn.style.boxShadow = "none";

  createBoard();
});
