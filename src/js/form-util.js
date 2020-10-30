import { $, $$, downloadBlob } from './dom-utils'
import { addSlash, getFormattedDate } from './util'
import pdfBase from '../certificate.pdf'
import { generatePdf } from './pdf-util'
import custom_profile from "../profile.json"

export function getProfile() {
  let now = new Date();
  let datesortie = now.toLocaleDateString('fr-FR').replace("-", "/");
  let heuresortie = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const fields = custom_profile;
  fields.datesortie = datesortie;
  fields.heuresortie = heuresortie;

  return fields
}

export function prepareForm() {
  const reason = $('#field-reason');
  const snackbar = $('#snackbar');

  $('#generate-btn').addEventListener('click', async () => {
    try {
      let reasonValue = reason.value;

      const pdfBlob = await generatePdf(getProfile(), [reasonValue], pdfBase)

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
