import rupiahFormater from "../../utils/rupiahFormater.js"

const invoice = (item) => {
  let sum = 0
  item.products.forEach((element) => {
    sum += parseInt(element.price * element.quantity)
  })
  const options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .invoice-container {
            width: 80%;
            margin: 0 auto;
            color: #25252A;
          }
          .invoice-header {
            background-color: #784ED5;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .invoice-details {
            margin-top: 20px;
          }
          .invoice-details div {
            margin-bottom: 10px;
          }
          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .invoice-table,
          .invoice-table th,
          .invoice-table td {
            border: 1px solid #ddd;
          }
          .invoice-table th,
          .invoice-table td {
            padding: 10px;
            text-align: left;
          }
          .invoice-total {
            margin-top: 20px;
            text-align: right;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <h1>Invoice</h1>
          </div>
          <div class="invoice-details">
            <div>Name: ${item.information.first_name + " " + item.information.last_name}</div>
            <div>Email: ${item.user_email}</div>
            <div>Invoice id: ${item._id}</div>
            <div>Invoice Date: ${new Date(item.created_at).toLocaleString(undefined, options)}</div>
            <div>Address: ${item.information.address}</div>
            <div>City: ${item.information.city}</div>
            <div>Phone Number: ${item.information.phone}</div>
          </.div>
          <table class="invoice-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Size</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody id="body" class="table-body">
            ${item.products
              .map((e) => {
                return `<tr>
              <td>${e.name}</td>
              <td>${e.quantity}</td>
              <td>${e.size}</td>
              <td>${rupiahFormater(e.price)}</td>
              <td>${rupiahFormater(parseInt(e.price * e.quantity))}</td>
              </tr>`
              })
              .join("")}
            </tbody>
          </table>
          <div class="invoice-total">
            <p><strong>Total: ${rupiahFormater(sum)} </strong></p>
          </div>
        </div>
      </body>
    </html>
    `
}

export default invoice
