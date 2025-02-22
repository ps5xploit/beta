function onload_setup() {
    if (document.documentElement.hasAttribute("manifest")) {
        add_cache_event_toasts();
    }

    create_redirector_buttons();

    document.documentElement.style.overflowX = 'hidden';
    let redirector = document.getElementById("redirector-view");
    let center_view = document.getElementById("center-view");

    let isTransitionInProgress = false;

    center_view.style.transition = "left 0.4s ease, opacity 0.25s ease";
    center_view.style.pointerEvents = "auto";
    center_view.style.opacity = "1";
    redirector.style.pointerEvents = "none";
    redirector.style.opacity = "0";

    window.addEventListener('keydown', function (event) {
        if (event.keyCode == 51 || event.keyCode == 118) {
            // seems like the browser failes to load any new pages after the jailbreak...
            if (isTransitionInProgress || window.jb_in_progress || window.jb_started) {
                return;
            }
            isTransitionInProgress = true;
            if (redirector.style.left == "-100%") {
                redirector.style.left = "-30%";
                setTimeout(() => {
                    redirector.style.transition = "left 0.4s ease, opacity 0.25s ease";

                    center_view.style.pointerEvents = "none";
                    center_view.style.opacity = "0";
                    redirector.style.pointerEvents = "auto";
                    redirector.style.opacity = "1";

                    redirector.style.left = "0";
                    center_view.style.left = "30%";
                    setTimeout(() => {
                        center_view.style.transition = "none";
                        center_view.style.left = "100%";
                        isTransitionInProgress = false;
                    }, 420);
                }, 10);

            } else {
                center_view.style.left = "30%";

                setTimeout(() => {
                    center_view.style.transition = "left 0.4s ease, opacity 0.25s ease";

                    center_view.style.pointerEvents = "auto";
                    center_view.style.opacity = "1";
                    redirector.style.pointerEvents = "none";
                    redirector.style.opacity = "0";

                    redirector.style.left = "-30%";
                    center_view.style.left = "0";
                    setTimeout(() => {
                        redirector.style.transition = "none";
                        redirector.style.left = "-100%";
                        isTransitionInProgress = false;
                    }, 420);
                }, 10);
            }
        }
    });

    create_redirector_buttons();
}

function redirectorGo() {
    let redirector_input = document.getElementById("redirector-input");
    let redirector_input_value = redirector_input.value;
    if (redirector_input_value == "" || redirector_input_value == "https://") {
        showToast("Enter a valid URL.");
        return;
    }

    let redirector_history_store_raw = localStorage.getItem("redirector_history");

    // Definir el límite máximo para el historial (por ejemplo, 10 elementos)
    const maxHistoryItems = 7;

    if (redirector_history_store_raw == null) {
        localStorage.setItem("redirector_history", JSON.stringify([redirector_input_value]));
    } else {
        let redirector_history_store = JSON.parse(redirector_history_store_raw);

        // Agregar el nuevo elemento al principio del array
        redirector_history_store.unshift(redirector_input_value);

        // Si el historial supera el límite, eliminar el último elemento
        if (redirector_history_store.length > maxHistoryItems) {
            redirector_history_store.pop(); // Elimina el último elemento
        }

        localStorage.setItem("redirector_history", JSON.stringify(redirector_history_store));
    }

    window.location = redirector_input_value;
}

const default_pinned_websites = [
    "https://ps5xploit.github.io",
    "https://ps5xploit-umtx.pages.dev",
];

const dummy_history = [
    "https://google.com",
    "https://ps5xploit.github.io/",
    "https://github.com",
    "https://youtube.com",
];

function create_redirector_buttons() {
    let redirector_pinned_store_raw = localStorage.getItem("redirector_pinned");

    // Definir el límite máximo para los favoritos (por ejemplo, 5 elementos)
    const maxFavoritesItems = 5;

    if (redirector_pinned_store_raw == null) {
        localStorage.setItem("redirector_pinned", JSON.stringify(default_pinned_websites));
        redirector_pinned_store_raw = localStorage.getItem("redirector_pinned");
    }

    let redirector_pinned_store = JSON.parse(redirector_pinned_store_raw);

    // Si los favoritos superan el límite, eliminar los elementos más antiguos
    if (redirector_pinned_store.length > maxFavoritesItems) {
        redirector_pinned_store = redirector_pinned_store.slice(0, maxFavoritesItems); // Conserva solo los primeros 5 elementos
        localStorage.setItem("redirector_pinned", JSON.stringify(redirector_pinned_store));
    }

    const redirector_pinned = document.getElementById("redirector-pinned");
    redirector_pinned.innerHTML = "";

    let pinned_text = document.createElement("p");
    pinned_text.innerHTML = "Favorites";
    pinned_text.style.textAlign = "center";

    redirector_pinned.appendChild(pinned_text);

    for (let i = 0; i < redirector_pinned_store.length; i++) {
        let div = document.createElement("div");
        div.style.display = "flex";

        let a1 = document.createElement("a");
        a1.className = "btn small-btn";
        a1.tabIndex = "0";
        a1.innerHTML = redirector_pinned_store[i];
        a1.onclick = () => {
            window.location = redirector_pinned_store[i];
        };

        div.appendChild(a1);

        let a2 = document.createElement("a");
        a2.className = "btn icon-btn";
        a2.tabIndex = "0";
        a2.innerHTML = '<svg width="24px" height="24px" fill="#ddd"><use href="#delete-icon" /></svg>';
        a2.onclick = () => {
            let pinned_raw = localStorage.getItem("redirector_pinned");
            let pinned = JSON.parse(pinned_raw);
            pinned.splice(i, 1);
            localStorage.setItem("redirector_pinned", JSON.stringify(pinned));
            create_redirector_buttons();
        };

        div.appendChild(a2);

        redirector_pinned.appendChild(div);
    }

    let redirector_history_store_raw = localStorage.getItem("redirector_history");

    if (redirector_history_store_raw == null) {
        localStorage.setItem("redirector_history", JSON.stringify([]));
        redirector_history_store_raw = localStorage.getItem("redirector_history");
    }

    let redirector_history_store = JSON.parse(redirector_history_store_raw);

    // Si el historial supera el límite, eliminar los elementos más antiguos
    if (redirector_history_store.length > maxHistoryItems) {
        redirector_history_store = redirector_history_store.slice(0, maxHistoryItems); // Conserva solo los primeros 10 elementos
        localStorage.setItem("redirector_history", JSON.stringify(redirector_history_store));
    }

    // history stuff
    let redirector_history = document.getElementById("redirector-history");

    redirector_history.innerHTML = "";

    let history_text = document.createElement("p");
    history_text.innerHTML = "History";
    history_text.style.textAlign = "center";

    redirector_history.appendChild(history_text);

    for (let i = 0; i < redirector_history_store.length; i++) {
        let div = document.createElement("div");
        div.style.display = "flex";

        let a1 = document.createElement("a");
        a1.className = "btn small-btn";
        a1.tabIndex = "0";
        a1.innerHTML = redirector_history_store[i];
        a1.onclick = () => {
            window.location = redirector_history_store[i];
        };
        div.appendChild(a1);

        let a2 = document.createElement("a");
        a2.className = "btn icon-btn";
        a2.tabIndex = "0";
        a2.innerHTML = "&#9733;";
        a2.onclick = () => {
            let pinned_raw = localStorage.getItem("redirector_pinned");
            let pinned = JSON.parse(pinned_raw);
            pinned.unshift(redirector_history_store[i]);
            localStorage.setItem("redirector_pinned", JSON.stringify(pinned));
            create_redirector_buttons();
        };
        div.appendChild(a2);

        let a3 = document.createElement("a");
        a3.className = "btn icon-btn";
        a3.tabIndex = "0";
        a3.innerHTML = '<svg width="24px" height="24px" fill="#ddd"><use href="#delete-icon" /></svg>';
        a3.onclick = () => {
            let history_raw = localStorage.getItem("redirector_history");
            let history = JSON.parse(history_raw);
            history.splice(i, 1);
            localStorage.setItem("redirector_history", JSON.stringify(history));
            create_redirector_buttons();
        };
        div.appendChild(a3);

        redirector_history.appendChild(div);
    }
}

async function switch_to_post_jb_view() {
    // should already be none but just in case
    document.getElementById("run-jb-parent").style.display = "none";

    document.getElementById("jb-progress").style.opacity = "0";
    await sleep(1000);
    document.getElementById("jb-progress").style.display = "none";

    document.getElementById("post-jb-view").style.opacity = "0";
    document.getElementById("post-jb-view").classList.add("opacity-transition");
    document.getElementById("post-jb-view").style.display = "flex";
    document.getElementById("post-jb-view").style.opacity = "1";

    document.getElementById("credits").style.opacity = "0";
    document.getElementById("credits").style.display = "none";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Trigger reflow and enable animation
    toast.offsetHeight;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, 2000);
}