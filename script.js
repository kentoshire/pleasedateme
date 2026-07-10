// =============================
// SUPABASE CONNECTION
// =============================

const { createClient } = supabase;

const supabaseClient = createClient(
    "https://hrinrvplfdeetfpyenkk.supabase.co",
    "sb_publishable_RX5jwT6HKs4B2n8bpAWUJQ_5gvWwIfI"
);

const urlParams = new URLSearchParams(window.location.search);
const invitationId = urlParams.get("id");

// =============================
// CREATE INVITATION (index.html)
// =============================

const createBtn = document.getElementById("createBtn");
const ownerName = document.getElementById("ownerName");
const result = document.getElementById("result");

if (createBtn) {

    createBtn.addEventListener("click", async () => {

        if (ownerName.value.trim() === "") {
            alert("Enter your name first ❤️");
            return;
        }


        const { data, error } = await supabaseClient
            .from("invitations")
            .insert([
                {
                    owner_name: ownerName.value,
                    status: "active"
                }
            ])
            .select()
            .single();


        if (error) {
            console.error(error);
            alert(error.message);
            return;
        }


const inviteLink =
`${window.location.origin}/invite.html?id=${data.id}`;


const dashboardLink =
`${window.location.origin}/dashboard.html?id=${data.id}`;



result.innerHTML = `
🎉 Your invitation is ready! ❤️

<br><br>

<b>Send this to your partner:</b>

<br>

<input value="${inviteLink}" readonly style="width:90%">


<br><br>


<b>Your Dashboard:</b>

<br>

<input value="${dashboardLink}" readonly style="width:90%">

`;
    
    });

}


// =============================
// ROMANTIC PAGE (invite.html)
// =============================

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const page3 = document.getElementById("page3");

const confirmBtn = document.getElementById("confirmBtn");
const chosenDate = document.getElementById("chosenDate");

const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const partnerName = document.getElementById("partnerName");

const bgMusic = document.getElementById("bgMusic");


if (yesBtn && noBtn) {

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


            const maxX =
            window.innerWidth - noBtn.offsetWidth - 20;

            const maxY =
            window.innerHeight - noBtn.offsetHeight - 20;


            noBtn.style.left =
            Math.random() * maxX + "px";


            noBtn.style.top =
            Math.random() * maxY + "px";

        }

    });



    yesBtn.addEventListener("click", () => {


        if (bgMusic && bgMusic.paused) {

            bgMusic.volume = 0;

            bgMusic.play();


            let volume = 0;


            const fade = setInterval(() => {

                if (volume < 0.4) {

                    volume += 0.02;
                    bgMusic.volume = volume;

                } else {

                    clearInterval(fade);

                }

            },100);

        }


        createHearts();


        setTimeout(() => {

            page1.classList.add("hidden");
            page2.classList.remove("hidden");

        },1500);

    });


}



// =============================
// DATE CONFIRMATION
// =============================

if (confirmBtn) {

    confirmBtn.addEventListener("click", async () => {


        if (
            dateInput.value === "" ||
            timeInput.value === ""
        ) {

            alert("Choose our date first ❤️");
            return;

        }


        if (!invitationId) {

            alert("Invalid invitation link");
            return;

        }

const { error } = await supabaseClient
    .from("responses")
    .insert([
        {
            invitation_id: invitationId,
            name: partnerName.value,
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

}




// =============================
// HEART ANIMATION
// =============================

function createHearts() {

    for (let i = 0; i < 80; i++) {


        let heart = document.createElement("div");

        heart.innerHTML = "💖";

        heart.style.position = "fixed";
        heart.style.left = Math.random()*100+"vw";
        heart.style.top = "100vh";
        heart.style.fontSize =
        (20 + Math.random()*30)+"px";

        heart.style.pointerEvents="none";
        heart.style.transition="all 3s linear";


        document.body.appendChild(heart);


        setTimeout(()=>{

            heart.style.top="-100px";
            heart.style.opacity=0;

        },50);


        setTimeout(()=>{

            heart.remove();

        },3000);

    }

}
// =============================
// DASHBOARD PAGE
// =============================

const dashboard = document.getElementById("dashboard");


if (dashboard) {

    const dashboardName = document.getElementById("partnerName");
    const dashboardDate = document.getElementById("dateTime");


    async function loadResponse(){


        console.log("Current ID:", invitationId);


        const { data, error } = await supabaseClient
            .from("responses")
            .select("*")
            .eq("invitation_id", invitationId);



        console.log("Data:", data);
        console.log("Error:", error);



        if(error){

            console.log(error);

            dashboardName.innerHTML =
            "Error loading response";

            return;

        }


        if(!data || data.length === 0){

            dashboardName.innerHTML =
            "No response yet 💔";

            return;

        }



        const response = data[0];


        dashboardName.innerHTML =
        "❤️ " + response.name;



        dashboardDate.innerHTML =
        `
        📅 ${response.date}
        <br><br>
        🕒 ${response.time}
        `;


    }


    loadResponse();

}
