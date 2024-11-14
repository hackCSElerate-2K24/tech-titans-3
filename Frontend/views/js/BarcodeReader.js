let scanResults = new Set();
    let scanner;
    function startScanning() {
        scanResults.clear();
        document.getElementById('result').innerHTML = "";
        document.getElementById('all-results').innerHTML = "";
        if (!scanner) {
            scanner = new Html5QrcodeScanner('reader', {
                qrbox: { width: 250, height: 250, },
                fps: 20,
            });
        }
        scanner.render(onScanSuccess, onScanError);
    }

    function onScanSuccess(result) {
        document.getElementById('success-sound').play();
        scanResults.add(result);
        document.getElementById('result').innerHTML = `
            <h2>Total Unique Scans: ${scanResults.size}</h2>
        `;
        printResults();
    }

    function printResults() {
        let allResultsHtml = "<h2>All Unique Scanned Product IDs:</h2><ul>";
        scanResults.forEach((productId, index) => {
            allResultsHtml += `<li>${index + 1}: ${productId}</li>`;
        });
        allResultsHtml += "</ul>";
        document.getElementById('all-results').innerHTML = allResultsHtml;
    }

    function onScanError(err) {
        console.error(err);
    }