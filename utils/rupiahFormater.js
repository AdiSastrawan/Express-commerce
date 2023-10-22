function rupiahFormater(amount) {
  if (isNaN(amount)) {
    return "Invalid input";
  }

  // Convert the number to a string and add commas as thousands separators
  let formattedNumber = amount.toLocaleString("id-ID");

  // Add the Rupiah symbol (Rp) and return the formatted string
  return `Rp. ${formattedNumber}`;
}

export default rupiahFormater;
