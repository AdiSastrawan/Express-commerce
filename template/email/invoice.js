const invoice = (items) => {
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
          }
          .invoice-header {
            background-color: #4caf50;
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
            <div>Invoice Number: INV123456</div>
            <div>Invoice Date: October 21, 2023</div>
            <div>Due Date: November 5, 2023</div>
          </div>
          <table class="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody id="body" class="table-body">
            ${items
              .map((e) => {
                return `<tr>
              <td>${e.description}</td>
              <td>${e.quantity}</td>
              <td>${e.unitPrice}</td>
              <td>${parseInt(e.unitPrice * e.quantity)}</td>
              </tr>`
              })
              .join("")}
            </tbody>
          </table>
          <div class="invoice-total">
            <p><strong>Total: $190.00</strong></p>
          </div>
        </div>
      </body>
    </html>
    `
}

export default invoice
