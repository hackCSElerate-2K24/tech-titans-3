// Variables for storing scan results and scanner instance
let scanResults = new Map();
let scanner;

// Start scanning QR codes
function startScanning() {
    scanResults.clear();
    document.getElementById('result').innerHTML = "";
    document.getElementById('all-results').innerHTML = "";

    if (!scanner) {
        scanner = new Html5QrcodeScanner('reader', {
            qrbox: { width: 250, height: 250 },
            fps: 20,
        });
    }
    scanner.render(onScanSuccess, onScanError);
}

// Handle a successful scan
async function onScanSuccess(result) {
    document.getElementById('success-sound').play();

    try {
        console.log(result);
        const response = await fetch('http://localhost:3000/getProduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "userEmail": "pavangowdats01@gmail.com", "productId": result })
        });

        if (response.status === 400) {
            alert('Product Not Found in Your Shop');
        } else {
            const product = await response.json();

            // Check if productId already exists in scanResults
            if (!scanResults.has(product.productId)) {
                scanResults.set(product.productId, { ...product, quantity: 1 });

                document.getElementById('result').innerHTML = `
                    <h2>Total Unique Scans: ${scanResults.size}</h2>
                `;
                printResults();
                document.dispatchEvent(new CustomEvent('scanResultsUpdated'));
            }
        }
    } catch (error) {
        console.error('Error fetching product:', error);
    }
}

// Print all scanned products in a list
function printResults() {
    let allResultsHtml = "<h2>All Unique Scanned Products:</h2><ul>";
    scanResults.forEach((product) => {
        allResultsHtml += `
            <li>
                ${product.productName} : 
                <input type="number" value="1" min="1" onchange="updateTotal(this, '${product.productId}', ${product.price})" /> 
                * ${product.price} = 
                <span class="total">${product.price}</span>
            </li>
        `;
    });
    allResultsHtml += "</ul>";
    document.getElementById('all-results').innerHTML = allResultsHtml;
}

// Update the total price when quantity changes
function updateTotal(inputElement, productId, price) {
    const quantity = parseInt(inputElement.value, 10) || 1;
    const total = price * quantity;
    inputElement.parentElement.querySelector('.total').textContent = total;
    scanResults.get(productId).quantity = quantity;  // Update quantity in scanResults
}

// Generate a PDF receipt with the scanned items and totals
async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Bill Receipt", 10, 10);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 20);

    // Table headers
    let yOffset = 30;
    doc.text("Product", 10, yOffset);
    doc.text("Quantity", 70, yOffset);
    doc.text("Price", 110, yOffset);
    doc.text("Total", 150, yOffset);

    yOffset += 10;

    // Table content
    let subtotal = 0;
    scanResults.forEach(product => {
        const total = product.price * product.quantity;
        subtotal += total;
        doc.text(product.productName, 10, yOffset);
        doc.text(product.quantity.toString(), 70, yOffset);
        doc.text(`$${product.price.toFixed(2)}`, 110, yOffset);
        doc.text(`$${total.toFixed(2)}`, 150, yOffset);
        yOffset += 10;
    });

    // Subtotal
    yOffset += 10;
    doc.setFontSize(14);
    doc.text("Subtotal:", 110, yOffset);
    doc.text(`$${subtotal.toFixed(2)}`, 150, yOffset);

    // Save the PDF
    doc.save("bill_receipt.pdf");
}

// Handle scan errors
function onScanError(err) {
    console.error(err);
}

document.addEventListener('scanResultsUpdated', () => {
    if (scanResults.size > 0) {
        document.getElementById('getMyBill').style.display = 'block';
    }
});