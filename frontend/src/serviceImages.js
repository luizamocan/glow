import IMG_MASSAGE from "./assets/massage.jpg";
import IMG_FACIAL from "./assets/facial.jpg";
import IMG_MANICURE from "./assets/manicure.jpg";
import IMG_BLOWDRY from "./assets/blow-dry.jpg";
import IMG_HAIRCUT from "./assets/haircut.jpg";
import IMG_COLORING from "./assets/hair-coloring.jpg";
import IMG_PEDICURE from "./assets/pedicure.jpg";
import IMG_TREATMENT from "./assets/spa-treatment.jpg";
import IMG_SHAPING from "./assets/eyebrow-shaping.jpg";

export const SERVICE_IMAGES = {
  "Deep Massage": IMG_MASSAGE,
  Facial: IMG_FACIAL,
  Manicure: IMG_MANICURE,
  "Hair Coloring": IMG_COLORING,
  "Spa Treatment": IMG_TREATMENT,
  Pedicure: IMG_PEDICURE,
  Haircut: IMG_HAIRCUT,
  "Eyebrow Shaping": IMG_SHAPING,
  "Blow Dry": IMG_BLOWDRY,
  "Blow dry": IMG_BLOWDRY,
};

export const getServiceImage = (service) =>
  service?.image || SERVICE_IMAGES[service?.name] || IMG_FACIAL;
