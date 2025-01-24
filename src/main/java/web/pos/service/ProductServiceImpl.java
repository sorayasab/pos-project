package web.pos.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import web.pos.model.Product;
import web.pos.repository.ProductDb;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    ProductDb productDb;

    @Override
    public List<Product> getAll(){
        return productDb.findAll();
    }

    
}
