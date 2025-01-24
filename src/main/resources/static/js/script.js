async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:8080/api/products');
        const products = await response.json();

        const productGrid = document.getElementById('product-grid');
        productGrid.innerHTML = '';

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <div class="product-name">${product.name}</div>
                <p>Rp ${product.price}</p>
            `;
            productDiv.onclick = () => addToInvoice(product.id);
            productGrid.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

async function fetchInvoices() {
    try {
        const response = await fetch('http://localhost:8080/api/invoices');
        const invoices = await response.json();

        updateInvoice(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
    }
}

async function addToInvoice(productId) {
    try {
        const response = await fetch(`http://localhost:8080/api/add/${productId}`, {
            method: 'POST'
        });

        if (response.ok) {
            fetchInvoices();
        } else {
            console.error('Failed to add product to invoice');
        }
    } catch (error) {
        console.error('Error adding product to invoice:', error);
    }
}

async function deleteAllInvoices() {
    try {
        const response = await fetch('http://localhost:8080/api/invoices', {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchInvoices();
        } else {
            console.error('Failed to delete all invoices');
        }
    } catch (error) {
        console.error('Error deleting invoices:', error);
    }
}

function updateInvoice(invoices) {
    const invoiceDiv = document.getElementById('invoice');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const subtotalButtonElement = document.getElementById('subtotal-button');
    let subtotal = 0;

    invoiceDiv.innerHTML = '';
    invoices.forEach(invoice => {
        invoiceDiv.innerHTML += `
            <p>${invoice.product.name} x${invoice.quantity} - Rp ${invoice.totalPrice}</p>
        `;
        subtotal += invoice.totalPrice;
    });

    subtotalElement.innerText = subtotal;
    totalElement.innerText = subtotal;
    subtotalButtonElement.innerText = subtotal; 
}

async function saveBill() {
    try {
        const doc = await generateInvoicePDF(); // Gunakan helper function
        doc.save('invoice.pdf'); // Simpan file PDF
    } catch (error) {
        console.error('Error saving bill:', error);
    }
    alert('Bill berhasil disimpan!');
}

async function charge() {
    const subtotalElement = document.getElementById('subtotal');
    const subtotal = parseFloat(subtotalElement.innerText);

    const payment = prompt(`Subtotal: Rp ${subtotal}\nMasukkan uang pembeli:`);
    if (!payment) {
        alert('Pembayaran dibatalkan.');
        return;
    }

    const change = payment - subtotal;
    if (change < 0) {
        alert('Uang tidak cukup!');
    } else {
        alert(`Transaksi berhasil!\nKembalian: Rp ${change}`);
        await deleteAllInvoices();
        fetchInvoices();
    }
}

async function generateInvoicePDF() {
    try {
        const response = await fetch('http://localhost:8080/api/invoices');
        const invoices = await response.json();

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Invoice', 10, 10);

        let yPosition = 20;
        doc.setFontSize(12);
        doc.text('Product Name', 10, yPosition);
        doc.text('Quantity', 80, yPosition);
        doc.text('Total Price', 150, yPosition);

        yPosition += 10;
        invoices.forEach((invoice) => {
            doc.text(invoice.product.name, 10, yPosition);
            doc.text(invoice.quantity.toString(), 80, yPosition);
            doc.text(`Rp ${invoice.totalPrice}`, 150, yPosition);
            yPosition += 10;
        });

        const subtotal = invoices.reduce((sum, invoice) => sum + invoice.totalPrice, 0);
        yPosition += 10;
        doc.text(`Subtotal: Rp ${subtotal}`, 10, yPosition);

        return doc; 
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}

async function printBill() {
    try {
        const doc = await generateInvoicePDF();
        const pdfBlob = doc.output('blob');

        const pdfURL = URL.createObjectURL(pdfBlob);
        const printWindow = window.open(pdfURL, '_blank');
        printWindow.onload = function () {
            printWindow.print();
        };
    } catch (error) {
        console.error('Error generating PDF for print:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    fetchInvoices();
});