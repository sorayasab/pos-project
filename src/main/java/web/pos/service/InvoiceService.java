package web.pos.service;

import java.util.List;

import web.pos.model.Invoice;

public interface InvoiceService {
    List<Invoice> getAll();
    Invoice addProductToInvoice(Long productId);
    public void deleteAll();
    
}
