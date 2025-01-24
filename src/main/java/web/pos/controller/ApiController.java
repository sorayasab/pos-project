package web.pos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import web.pos.model.Invoice;
import web.pos.service.InvoiceService;
import web.pos.service.ProductService;

@RestController
@RequestMapping("/api")
public class ApiController {

    @Autowired
    private ProductService productService;

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping("/products")
    public ResponseEntity<?> getAllProducts() {
        return ResponseEntity.ok(productService.getAll());
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<?> addProductToInvoice(@PathVariable Long productId) {
        try {
            Invoice invoice = invoiceService.addProductToInvoice(productId);
            return ResponseEntity.ok(invoice);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/invoices")
    public ResponseEntity<?> getAllInvoices() {
        List<Invoice> invoices = invoiceService.getAll();
        return ResponseEntity.ok(invoices);
    }

    @DeleteMapping("/invoices")
    public ResponseEntity<?> deleteAllInvoices() {
        invoiceService.deleteAll();
        return ResponseEntity.ok("Semua invoice berhasil dihapus");
    }
}
