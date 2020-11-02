import { $, $$, createElement, downloadBlob } from './dom-utils'
import pdfBase from '../certificate.pdf'
import { generatePdf } from './pdf-util'
import custom_profiles from "../profile.json"

const reasonLabels = {
  "enfants": "Ecole",
  "travail": "Travail",
  "achats": "Courses",
  "sante": "Médecin",
  "famille": "Raison familiale",
  "sport_animaux": "Sport",
  "convocation": "Convocation",
  "missions": "Mission d'intéret général"
};
var reasonValues = ["enfants", "travail"];

export function getProfile() {
  const profileIndex = +$("#field-profile").value;

  const now = new Date();
  const datesortie = now.toLocaleDateString('fr-FR').replace("-", "/");
  const heuresortie = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const fields = custom_profiles[profileIndex];
  fields.datesortie = datesortie;
  fields.heuresortie = heuresortie;

  return fields;
}

export function prepareForm() {
  const profileSelect = $('#field-profile');
  const snackbar = $('#snackbar');

  profileSelect.innerHTML = "";
  for (let i = 0; i < custom_profiles.length; i++) {
    let option = createElement("option", { value: i });
    $("#field-profile").appendChild(option);
    option.innerHTML = `${custom_profiles[i].firstname} ${custom_profiles[i].lastname}`;
  }

  let isFirst = true;
  for (let r in reasonLabels) {
    let nav = createElement("a", {
      "href": "javascript: void(0)",
      "data-reason": r,
      "class": `flex-sm-fill border border-light mb-2 nav-link ${isFirst ? "" : "ml-2"} ${reasonValues.includes(r) ? "active" : ""}`
    });
    nav.innerHTML = `<i class="icon-${r}"></i>&nbsp;${reasonLabels[r]}`;
    $("#field-reason").appendChild(nav);

    nav.addEventListener("click", () => {
      nav.classList.toggle(`active`);
    });
  }

  $('#generate-btn').addEventListener('click', async () => {
    try {
      debugger;
      let reasonValues = $$("#field-reason .active").map(e => e.getAttribute("data-reason"));

      const pdfBlob = await generatePdf(getProfile(), reasonValues, pdfBase)

      const creationInstant = new Date();
      const creationDate = creationInstant.toLocaleDateString('fr-FR');
      const creationHour = creationInstant
        .toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        .replace(':', '-');

      downloadBlob(pdfBlob, `attestation-${creationDate}_${creationHour}.pdf`);

      snackbar.classList.remove('d-none');
      setTimeout(() => snackbar.classList.add('show'), 100);

      setTimeout(() => {
        snackbar.classList.remove('show');
        setTimeout(() => snackbar.classList.add('d-none'), 500);
      }, 6000);
    } catch (e) {
      console.error(e);
    }
  })
}
