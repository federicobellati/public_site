(() => {
  "use strict";

  const status = document.getElementById("profile-copy-status");

  function copyWithSelection(text) {
    const field = document.createElement("textarea");
    const previousFocus = document.activeElement;
    field.value = text;
    field.readOnly = true;
    field.setAttribute("aria-label", "Prefix da copiare");
    field.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
    document.body.append(field);
    try {
      field.select();
      field.setSelectionRange(0, text.length);
      if (!document.execCommand("copy")) throw new Error("Copia non disponibile");
    } finally {
      field.remove();
      previousFocus?.focus({ preventScroll: true });
    }
  }

  for (const button of document.querySelectorAll(".profile-copy")) {
    const code = document.getElementById(button.dataset.copy);
    if (!code) continue;
    const label = button.getAttribute("aria-label");
    let resetTimer;
    button.hidden = false;

    button.addEventListener("click", async () => {
      if (button.disabled) return;
      clearTimeout(resetTimer);
      status.textContent = "";
      button.disabled = true;
      try {
        const text = code.textContent.trim();
        if (navigator.clipboard?.writeText) {
          try {
            await navigator.clipboard.writeText(text);
          } catch {
            copyWithSelection(text);
          }
        } else {
          copyWithSelection(text);
        }
        button.dataset.state = "copied";
        button.title = "Copiato!";
        button.setAttribute("aria-label", `${label} — copiato`);
        status.textContent = `${label.replace("Copia il", "Copiato il")}`;
      } catch {
        button.dataset.state = "error";
        button.title = "Copia non riuscita. Seleziona il testo del prefix per copiarlo.";
        button.setAttribute("aria-label", button.title);
        status.textContent = button.title;
      } finally {
        button.disabled = false;
        resetTimer = setTimeout(() => {
          delete button.dataset.state;
          button.title = label;
          button.setAttribute("aria-label", label);
        }, 2500);
      }
    });
  }
})();
