/**
 * Converts a number to French words for financial sums (Dirhams).
 * Simplified version for the scope of this project.
 */
export function numberToFrenchWords(n: number): string {
  if (n === 0) return "zéro dirhams";

  const units = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"];
  const tens = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"];
  const teens = ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];

  function convertGroup(n: number): string {
    let s = "";
    const h = Math.floor(n / 100);
    const remainder = n % 100;

    if (h > 0) {
      if (h === 1) s += "cent ";
      else s += units[h] + " cent ";
    }

    if (remainder > 0) {
      if (remainder < 10) {
        s += units[remainder];
      } else if (remainder >= 10 && remainder < 20) {
        s += teens[remainder - 10];
      } else {
        const t = Math.floor(remainder / 10);
        const u = remainder % 10;
        if (t === 7) {
          s += "soixante-" + (u === 1 ? "et-" : "") + teens[u];
        } else if (t === 9) {
          s += "quatre-vingt-" + teens[u];
        } else {
          s += tens[t] + (u === 1 ? " et " : (u > 0 ? "-" : "")) + units[u];
        }
      }
    }
    return s.trim();
  }

  const millions = Math.floor(n / 1000000);
  const thousands = Math.floor((n % 1000000) / 1000);
  const rest = Math.floor(n % 1000);
  const cents = Math.round((n - Math.floor(n)) * 100);

  let result = "";
  if (millions > 0) {
    result += convertGroup(millions) + (millions > 1 ? " millions " : " million ");
  }
  if (thousands > 0) {
    if (thousands === 1) result += "mille ";
    else result += convertGroup(thousands) + " mille ";
  }
  if (rest > 0 || (millions === 0 && thousands === 0)) {
    result += convertGroup(rest);
  }

  result = result.trim() + " dirhams";

  if (cents > 0) {
    result += " et " + convertGroup(cents) + " centimes";
  }

  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
