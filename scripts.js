function playSound() {
    const audio = new Audio("./assets/smash.mp3");
    audio.play();
}

const hammer = $(".hammer");
let score = 0;
let timeLeft = 30;
let gameActive = false;
let moleTimer = null;
let countdownTimer = null;

// Score and timer UI
$("body").append(`
    <div id="hud" style="text-align:center; font-size: 24px; font-family: Arial; margin: 10px;">
        <span>Score: <strong id="score">0</strong></span> &nbsp;|&nbsp;
        <span>Time: <strong id="timer">30</strong>s</span> &nbsp;|&nbsp;
        <button id="startBtn">Start Game</button>
    </div>
`);

$("#startBtn").on("click", function () {
    if (gameActive) return;
    startGame();
});

function startGame() {
    score = 0;
    timeLeft = 30;
    gameActive = true;
    $("#score").text(score);
    $("#timer").text(timeLeft);
    $("#startBtn").prop("disabled", true);

    // hide all moles
    $(".mole").removeClass("hidden");
    $(".mole-hit").addClass("hidden");
    $(".hole").each(function () {
        $(this).find(".mole").addClass("hidden");
    });

    spawnMoles();

    countdownTimer = setInterval(function () {
        timeLeft--;
        $("#timer").text(timeLeft);
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    clearInterval(moleTimer);
    clearInterval(countdownTimer);

    // hide all moles
    $(".hole").each(function () {
        $(this).find(".mole").addClass("hidden");
        $(this).find(".mole-hit").addClass("hidden");
    });

    $("#startBtn").prop("disabled", false);
    alert("Game Over! Your score: " + score);
}

function spawnMoles() {
    const holes = $(".hole");

    moleTimer = setInterval(function () {
        if (!gameActive) return;

        // hide all moles first
        holes.each(function () {
            $(this).find(".mole").addClass("hidden");
        });

        // pick 1 or 2 random holes to show moles (gets harder over time)
        const count = timeLeft < 15 ? 2 : 1;
        const shuffled = holes.toArray().sort(() => Math.random() - 0.5);

        for (let i = 0; i < count; i++) {
            const hole = $(shuffled[i]);
            if (!hole.find(".mole-hit").is(":visible")) {
                hole.find(".mole").removeClass("hidden");
            }
        }

    }, timeLeft < 15 ? 700 : 1000); // speeds up after 15s
}

$(window).on("mousemove", function (e) {
    hammer.css({
        left: e.originalEvent.clientX - 100,
        top: e.originalEvent.clientY - 100
    });
});

$(window).on("click", function (e) {
    hammer.css("transform", "rotate(-30deg)");
    setTimeout(function () {
        hammer.css("transform", "rotate(0deg)");
    }, 100);
});

$(".hole").on("click", function (e) {
    if (!gameActive) return;

    const mole = $(this).find(".mole");
    const moleHit = $(this).find(".mole-hit");

    // Do nothing if no mole or already hit
    if (mole.hasClass("hidden") || moleHit.is(":visible")) return;

    // play the hit sound
    playSound();

    // update score
    score++;
    $("#score").text(score);

    // hide the mole, show the hit mole
    mole.addClass("hidden");
    moleHit.removeClass("hidden");

    // 500ms later hide the hit mole
    setTimeout(function () {
        moleHit.addClass("hidden");
    }, 500);
});
