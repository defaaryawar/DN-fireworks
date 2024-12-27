const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let clickCount = 0;
const TOTAL_CLICKS = 10;

// Inisialisasi progress bar
const progressBar = document.createElement("div");
progressBar.className = "progress-bar";
const progressFill = document.createElement("div");
progressFill.className = "progress-fill";
progressBar.appendChild(progressFill);
document.body.appendChild(progressBar);

// Fungsi untuk membuat kembang api
function createFirework(x, y, special = false) {
    const colors = special ? 
        ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'] :
        ['#ff4747', '#ffbe47', '#47ff74', '#4775ff', '#d647ff', '#ff47d6', '#47ffdd', '#ff6347'];
    
    const firework = {
        x,
        y: canvas.height,
        targetY: y,
        exploded: false,
        particles: [],
        color: colors[Math.floor(Math.random() * colors.length)],
        special
    };

    const particleCount = special ? 150 : 100;
    
    for (let i = 0; i < particleCount; i++) {
        firework.particles.push({
            x,
            y,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * (special ? 8 : 5) + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            length: Math.random() * (special ? 60 : 40) + 20,
            life: Math.random() * 500 + 300,
            opacity: 1,
            size: special ? Math.random() * 3 + 2 : Math.random() * 2 + 1
        });
    }

    fireworks.push(firework);
}

// Fungsi untuk menampilkan countdown
function showCountdown(number) {
    const countdown = document.createElement("div");
    countdown.className = "countdown";
    countdown.textContent = number;
    document.body.appendChild(countdown);

    setTimeout(() => {
        countdown.style.animation = "pulseIn 0.5s ease-out reverse forwards";
        setTimeout(() => countdown.remove(), 500);
    }, 400);
}

// Update progress bar
function updateProgressBar() {
    const progress = (clickCount / TOTAL_CLICKS) * 100;
    progressFill.style.width = `${progress}%`;
}

// Fungsi untuk update kembang api
function updateFireworks() {
    for (let i = fireworks.length - 1; i >= 0; i--) {
        const firework = fireworks[i];

        if (!firework.exploded) {
            firework.y -= 8;
            if (firework.y <= firework.targetY) {
                firework.exploded = true;
                if (firework.special) {
                    createExplodingText(firework.x, firework.y, "✨ Happy Monthsary Sayangkuu ✨", "❤️ I LOVE YOU! ❤️");
                }
            }
        } else {
            for (let j = firework.particles.length - 1; j >= 0; j--) {
                const p = firework.particles[j];
                p.life--;
                p.opacity -= 0.005;
                if (p.life <= 0 || p.opacity <= 0) {
                    firework.particles.splice(j, 1);
                } else {
                    p.x += Math.cos(p.angle) * p.speed;
                    p.y += Math.sin(p.angle) * p.speed;
                    p.speed *= 0.99;
                    p.y += 0.5;
                }
            }
            if (firework.particles.length === 0) {
                fireworks.splice(i, 1);
            }
        }
    }
}

// Fungsi untuk menggambar kembang api
function drawFireworks() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const firework of fireworks) {
        if (!firework.exploded) {
            ctx.fillStyle = firework.color;
            ctx.fillRect(firework.x - 2, firework.y, 4, 15);

            for (let i = 0; i < 5; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 5;
                const sparkleX = firework.x + Math.cos(angle) * distance;
                const sparkleY = firework.y + 15 + Math.sin(angle) * distance;
                
                ctx.beginPath();
                ctx.arc(sparkleX, sparkleY, 1, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 70%, ${Math.random()})`;
                ctx.fill();
            }
        } else {
            for (const p of firework.particles) {
                ctx.strokeStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.lineWidth = p.size;
                
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(
                    p.x - Math.cos(p.angle) * p.length,
                    p.y - Math.sin(p.angle) * p.length
                );
                ctx.stroke();
                
                if (Math.random() > 0.8) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;
        }
    }
}

// Fungsi untuk membuat teks meledak
function createExplodingText(x, y, text1, text2) {
    const container = document.createElement("div");
    container.className = "firework-message";
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;

    const lines = [text1, text2];
    lines.forEach((line, lineIndex) => {
        const lineDiv = document.createElement("div");
        lineDiv.classList.add("firework-line");

        line.split("").forEach((char, charIndex) => {
            const span = document.createElement("span");
            span.textContent = char.trim() === "" ? "\u00A0" : char;
            span.classList.add("firework-char");

            // Menambahkan letter-spacing pada setiap karakter
            span.style.letterSpacing = "3px";  // Menambahkan jarak antar huruf (ubah sesuai kebutuhan)
            
            lineDiv.appendChild(span);

            gsap.fromTo(
                span,
                {
                    x: 0,
                    y: 0,
                    opacity: 0,
                    scale: 0.5,
                },
                {
                    x: Math.random() * 250 - 125,
                    y: Math.random() * 250 - 125,
                    opacity: 1,
                    scale: 1,
                    duration: 0.1,
                    delay: charIndex * 0.05,
                    ease: "power4.out",
                }
            );

            gsap.to(span, {
                x: (charIndex - line.length / 2) * 12,
                y: lineIndex * 25,
                duration: 0.25,
                delay: charIndex * 0.08 + 0.2,
                ease: "power2.inOut",
            });
        });

        container.appendChild(lineDiv);
    });

    document.body.appendChild(container);

    gsap.to(container, {
        opacity: 0,
        duration: 0.3,
        delay: 3,
        onComplete: () => container.remove(),
    });
}

function showPopUp() {
    const popUp = document.createElement("div");
    popUp.className = "popup";

    const images = [
        "/images/1.jpeg",
        "/images/2.jpeg",
        "/images/3.jpeg",
        "/images/4.jpeg",
        "/images/5.jpeg",
    ];

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    images.forEach((imgSrc, index) => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.classList.add("popup-image");
        if (index === 0) img.classList.add("active");
        imageContainer.appendChild(img);
    });

    const prevButton = document.createElement("button");
    prevButton.className = "popup-button";
    prevButton.innerHTML = "←";

    const nextButton = document.createElement("button");
    nextButton.className = "popup-button";
    nextButton.innerHTML = "→";

    popUp.appendChild(imageContainer);
    popUp.appendChild(prevButton);
    popUp.appendChild(nextButton);
    document.body.appendChild(popUp);

    let currentIndex = 0;
    let isTransitioning = false;
    const imagesElements = imageContainer.querySelectorAll('.popup-image');

    function changeImage(direction = 1) {
        if (isTransitioning) return;
        isTransitioning = true;

        imagesElements[currentIndex].classList.remove("active");
        currentIndex = (currentIndex + direction + images.length) % images.length;
        imagesElements[currentIndex].classList.add("active");

        setTimeout(() => {
            isTransitioning = false;
        }, 800);

        // Create celebration fireworks
        const randomX = Math.random() * canvas.width;
        const randomY = Math.random() * canvas.height * 0.5;
        createFirework(randomX, randomY, true);
    }

    prevButton.addEventListener("click", () => changeImage(-1));
    nextButton.addEventListener("click", () => changeImage(1));

    // Auto-advance carousel
    const autoAdvance = setInterval(() => changeImage(1), 3000);

    // Clear interval when popup is removed
    popUp.addEventListener("remove", () => clearInterval(autoAdvance));

    // Start automatic fireworks
    setTimeout(() => {
        setInterval(() => {
            const randomX = Math.random() * canvas.width;
            const randomY = Math.random() * canvas.height * 0.5;
            createFirework(randomX, randomY, true);
        }, 2500);
    }, 1000);
}

// Event listener untuk klik canvas
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create fireworks on each click
    createFirework(x, y, clickCount === 9);
    clickCount++;

    const remainingClicks = TOTAL_CLICKS - clickCount;
    if (remainingClicks >= 0) {
        showCountdown(remainingClicks);
        updateProgressBar();
    }

    // When the 10th click is reached, show fireworks and delay popup
    if (clickCount === TOTAL_CLICKS) {
        // Create celebration fireworks with a small delay between each
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const randomX = Math.random() * canvas.width;
                const randomY = Math.random() * canvas.height * 0.5;
                createFirework(randomX, randomY, true);
            }, i * 200);
        }
        
        // Wait for 3 seconds before showing the popup
        setTimeout(() => {
            showPopUp(); // Show the popup after the delay
        }, 3000);
    }
});

// Fungsi animasi
function animate() {
    updateFireworks();
    drawFireworks();
    requestAnimationFrame(animate);
}

animate();

// Event listener untuk resize window
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});