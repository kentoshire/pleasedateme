const { createClient } = supabase;

const supabaseClient = createClient(
    "https://hrinrvplfdeetfpyenkk.supabase.co",
    "sb_publishable_RX5jwT6HKs4B2n8bpAWUJQ_5gvWwIfI"
    );

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const page3 = document.getElementById("page3");

const confirmBtn = document.getElementById("confirmBtn");
const chosenDate = document.getElementById("chosenDate");

const nameInput = document.getElementById("name");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
// Background Music
const bgMusic = document.getElementById("bgMusic");

const noMessages = [
    "Are you sure? 🥺",
    "Really? 😭",
    "Think again ❤️",
    "Please? 🥹",
    "Pretty please? 💕",
    "I'll buy you food 🍕",
    "I'll buy you milk tea 🧋",
    "I'll bring flowers 🌹",
    "Don't break my heart 💔",
    "Last chance 😭",
    "You can't escape 😂"
];

let clickCount = 0;
let yesScale = 1;

noBtn.addEventListener("click", () => {

    clickCount++;

    if (clickCount < noMessages.length) {
        noBtn.innerText = noMessages[clickCount];
    }

    yesScale += 0.25;
    yesBtn.style.transform = `scale(${yesScale})`;

    if (clickCount >= 5) {

        noBtn.style.position = "absolute";

        const maxX = window.innerWidth - noBtn.offsetWidth - 20;
        const maxY = window.innerHeight - noBtn.offsetHeight - 20;

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        noBtn.style.left = randomX + "px";
        noBtn.style.top = randomY + "px";
    }

});

yesBtn.addEventListener("click", () => {

    // Play music with fade-in
    if (bgMusic && bgMusic.paused) {

        bgMusic.volume = 0;

        bgMusic.play().catch(error => {
            console.log("Music couldn't play:", error);
        });

        let volume = 0;

        const fade = setInterval(() => {

            if (volume < 0.4) {
                volume += 0.02;
                bgMusic.volume = volume;
            } else {
                clearInterval(fade);
            }

        }, 100);

    }

    createHearts();

    setTimeout(() => {

        page1.classList.add("hidden");
        page2.classList.remove("hidden");

    }, 1500);

});

confirmBtn.addEventListener("click", async () => {

   if (
    nameInput.value === "" ||
    dateInput.value === "" ||
    timeInput.value === ""
) {
    alert("Please enter your name and choose our date ❤️");
    return;
}
    

    const { error } = await supabaseClient
    .from("responses")
    .insert([
    {
        name: nameInput.value,
        date: dateInput.value,
        time: timeInput.value
    }
]);

if (error) {
    console.error(error);
    alert(error.message);
    return;
}
    page2.classList.add("hidden");
    page3.classList.remove("hidden");

    chosenDate.innerHTML =
        `📅 ${dateInput.value}<br><br>🕒 ${timeInput.value}`;

});

function createHearts() {

    for (let i = 0; i < 80; i++) {

        let heart = document.createElement("div");

        heart.innerHTML = "💖";

        heart.style.position = "fixed";
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.top = "100vh";
        heart.style.fontSize = (20 + Math.random() * 30) + "px";
        heart.style.pointerEvents = "none";
        heart.style.transition = "all 3s linear";

        document.body.appendChild(heart);

        setTimeout(() => {

            heart.style.top = "-100px";
            heart.style.transform = `translateX(${Math.random() * 300 - 150}px) rotate(${Math.random() * 360}deg)`;
            heart.style.opacity = 0;

        }, 50);

        setTimeout(() => {

            heart.remove();

        }, 3000);

    }

}
