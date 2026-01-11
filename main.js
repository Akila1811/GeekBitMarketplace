console.log("Main.js je počeo sa radom.");

// --- 1. PODEŠAVANJE PLACEHOLDERA (LOGO) ---

const PLACEHOLDER_IMG = "assets/img/neon-logo1.png"; 

// --- FUNKCIJA ZA PORUKE ---
function prikaziPoruku(naslov, tekst) {
    const box = document.getElementById('custom-alert-box');
    if(box) {
        document.getElementById('alert-title').innerText = naslov;
        document.getElementById('alert-message').innerText = tekst;
        box.style.display = 'block';
    } else {
        console.error("FALLBACK PORUKA: " + naslov + " - " + tekst);
    }
}
function zatvoriAlert() {
    const box = document.getElementById('custom-alert-box');
    if(box) box.style.display = 'none';
}

// --- 2. PODACI (SVI SU SA INTERNETA) ---
// --- 2. PODACI (POPRAVLJENE KATEGORIJE) ---
const defaultProizvodi = [
    {
        id: 1,
        naziv: "RTX 3090 TI",
        kategorija: "gpu", 
        cena: 200,
        stanje: "polovno",
        prodavac: "Una Nenezić",
        telefon: "061111222",
        email: "una@example.com",
        slika: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80" 
    },
    {
        id: 2,
        naziv: "AMD RYZEN 7 5800X3D",
        kategorija: "cpu",
        cena: 320,
        stanje: "polovno",
        prodavac: "PC_Master",
        telefon: "063333444",
        email: "pcmaster@example.com",
        slika: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        naziv: "NVIDIA RTX 4070",
        kategorija: "gpu",
        cena: 650,
        stanje: "novo",
        prodavac: "MarkoTech99",
        telefon: "064555666",
        email: "marko@example.com",
        slika: "https://images.unsplash.com/photo-1626218174358-77b797576550?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        naziv: "RTX 3090 TI",
        kategorija: "gpu", 
        cena: 400,
        stanje: "polovno",
        prodavac: "Aleksa Krivokapić",
        telefon: "069143143",
        email: "aleksa@geekbit.com",
        slika: "https://images.unsplash.com/photo-1555618568-9a674477f722?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        naziv: "RTX 3060",
        kategorija: "gpu", 
        cena: 300,
        stanje: "polovno",
        prodavac: "Aleksa Krivokapić",
        telefon: "069143143",
        email: "aleksa@geekbit.com",
        slika: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80"
    }
];

function ucitajProizvode() {
    try {
        const sacuvani = localStorage.getItem('geekbit_proizvodi');
        if (sacuvani) {
            const parsirani = JSON.parse(sacuvani);
            // Provera da li su podaci stari (bez slika) ili novi
            if(parsirani.length >= defaultProizvodi.length) {
                return parsirani;
            }
        }
    } catch (e) { console.error(e); }
    
    sacuvajProizvode(defaultProizvodi);
    return defaultProizvodi;
}

function sacuvajProizvode(niz) {
    localStorage.setItem('geekbit_proizvodi', JSON.stringify(niz));
}

let proizvodi = ucitajProizvode();

// ... DALJE NASTAVLJA FUNKCIJA napraviKarticu ...

// --- 2. KARTICE ---
function napraviKarticu(p) {
    if (!p) return '';
    
    let slikaSrc = p.slika && p.slika.trim() !== "" ? p.slika : PLACEHOLDER_IMG;
    let tel = p.telefon ? p.telefon : "Nema broja";
    let stanjeKlase = p.stanje ? p.stanje.toLowerCase() : 'novo';
    let stanjeTekst = p.stanje || 'Novo';

    return `
        <div class="card">
            <div class="img-wrapper">
                <img src="${slikaSrc}" alt="${p.naziv}" loading="lazy" onerror="this.onerror=null; this.src='${PLACEHOLDER_IMG}'">
            </div>
            <div class="card-body">
                <h3>${p.naziv}</h3>
                <div class="meta-info">
                    <span class="category"><i class="fas fa-microchip"></i> ${(p.kategorija || 'ostalo').toUpperCase()}</span>
                    <span class="seller"><i class="fas fa-user"></i> ${p.prodavac || 'Nepoznat'}</span>
                </div>
                <div class="price-row">
                    <div class="price">${p.cena} €</div>
                    <span class="state-badge ${stanjeKlase}">${stanjeTekst}</span>
                </div>
                <button class="contact-btn" onclick="otvoriKontakt('${p.prodavac}', '${p.email}', '${tel}')">
                    KONTAKTIRAJ
                </button>
            </div>
        </div>
    `;
}

// --- 3. PRIKAZIVANJE ---
const latestContainer = document.getElementById('latest-container'); 
const allContainer = document.getElementById('all-products-container'); 

function osveziPrikaz(filter = 'sve') {
    try {
        // SCENARIO A: POČETNA
        if (latestContainer) {
            // Prikazujemo prvih 8 (ili koliko ima)
            const najnoviji = [...proizvodi].reverse().slice(0, 8);
            latestContainer.innerHTML = najnoviji.map(p => napraviKarticu(p)).join('');
        }

        // SCENARIO B: STRANICA KOMPONENTE
        if (allContainer) {
            const filtrirani = proizvodi.filter(p => filter === 'sve' || p.kategorija === filter);
            
            if(filtrirani.length === 0) {
                allContainer.innerHTML = '<p style="text-align:center; width:100%; padding:20px;">Nema rezultata za ovu kategoriju.</p>';
            } else {
                allContainer.innerHTML = [...filtrirani].reverse().map(p => napraviKarticu(p)).join('');
            }
        }
    } catch (e) {
        console.error(e);
    }
}

osveziPrikaz();

// --- 4. DODAVANJE OGLASA ---
const forma = document.getElementById('oglas-form');
if (forma) {
    forma.addEventListener('submit', function(e) {
        e.preventDefault();

        const ime = document.getElementById('prodavac-ime').value;
        const email = document.getElementById('prodavac-email').value;
        const tel = document.getElementById('prodavac-tel').value;
        const naziv = document.getElementById('naziv').value;
        const cena = document.getElementById('cena').value;
        const kategorija = document.getElementById('kategorija').value;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telRegex = /^[\d\s\-\+]{6,20}$/;

        let greske = [];

        if (!emailRegex.test(email)) greske.push("Email adresa nije u dobrom formatu!");
        if (!telRegex.test(tel)) greske.push("Broj telefona nije ispravan!");
        if (ime.length < 2) greske.push("Ime mora imati bar 2 slova.");
        if (cena <= 0) greske.push("Cena mora biti veća od 0.");

        if (greske.length > 0) {
            prikaziPoruku("GREŠKA PRI UNOSU", greske.join("\n"));
            return; 
        }

        const noviProizvod = {
            id: Date.now(),
            naziv: naziv,
            kategorija: kategorija,
            cena: document.getElementById('cena').value,
            slika: document.getElementById('slika-url').value,
            stanje: document.querySelector('input[name="stanje"]:checked').value,
            prodavac: ime,
            email: email,
            telefon: tel
        };

        proizvodi.push(noviProizvod);
        sacuvajProizvode(proizvodi);

        prikaziPoruku("USPEH!", "Oglas je uspešno postavljen.");
        forma.reset();
        osveziPrikaz();
    });
}

// --- 5. FILTERI ---
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        osveziPrikaz(e.target.dataset.cat);
    });
});

// --- 6. MODAL ZA KONTAKT ---
const contactModal = document.getElementById("contact-modal");

function otvoriKontakt(ime, email, telefon) {
    if(!contactModal) return;
    document.getElementById("modal-seller-name").innerText = ime;
    document.getElementById("modal-seller-email").innerText = email;
    document.getElementById("modal-seller-email").href = "mailto:" + email;
    document.getElementById("modal-seller-phone").innerText = telefon;
    document.getElementById("modal-seller-phone").href = "tel:" + telefon;
    
    contactModal.style.display = "block";
}

function zatvoriKontakt() {
    if(contactModal) contactModal.style.display = "none";
}

const closeContactBtn = document.querySelector(".close-contact");
if(closeContactBtn) closeContactBtn.onclick = zatvoriKontakt;

window.onclick = function(event) {
    if (contactModal && event.target == contactModal) {
        contactModal.style.display = "none";
    }
}


// --- 7. DUGME ISTRAŽI PONUDU (SMOOTH SCROLL) ---
const exploreBtn = document.getElementById('explore-btn');

if (exploreBtn) {
    exploreBtn.addEventListener('click', function() {
        // Tražimo sekciju sa najnovijim oglasima
        const sekcija = document.querySelector('.latest-drops');
        if (sekcija) {
            sekcija.scrollIntoView({ behavior: 'smooth' });
        }
    });
}