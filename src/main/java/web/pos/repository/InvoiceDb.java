package web.pos.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import web.pos.model.Invoice;

public interface InvoiceDb extends JpaRepository<Invoice, Long>{
    Invoice findByProductId(Long productId);
}
