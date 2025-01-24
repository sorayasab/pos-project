package web.pos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import web.pos.model.Product;

@Repository
@Transactional
public interface ProductDb extends JpaRepository<Product,Long>{
    
}
