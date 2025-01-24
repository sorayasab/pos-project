package web.pos.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import web.pos.model.Invoice;
import web.pos.model.Product;
import web.pos.repository.InvoiceDb;
import web.pos.repository.ProductDb;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private ProductDb productDb;

    @Autowired
    private InvoiceDb invoiceDb;

    @Override
    public List<Invoice> getAll() {
        return invoiceDb.findAll();
    }

    @Override
    public void deleteAll() {
        invoiceDb.deleteAll();
    }
    
    @Override
    public Invoice addProductToInvoice(Long productId){
        Product product = productDb.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produk dengan ID " + productId + " tidak ditemukan"));

        Invoice existingInvoice = invoiceDb.findByProductId(productId);
        if (existingInvoice != null) {
            existingInvoice.setQuantity(existingInvoice.getQuantity() + 1);
            existingInvoice.setTotalPrice(existingInvoice.getQuantity() * product.getPrice());
            return invoiceDb.save(existingInvoice);
        }

        Invoice newInvoice = new Invoice();
        newInvoice.setProduct(product);
        newInvoice.setQuantity(1);
        newInvoice.setTotalPrice(product.getPrice());
        return invoiceDb.save(newInvoice);
    }

        
}