package poly.com.tshop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import poly.com.tshop.domain.Category;
import poly.com.tshop.exception.CategoryException;
import poly.com.tshop.repository.CategoryRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    @Autowired
    private  CategoryRepository categoryRepository;

    public  Category save(Category entity) {
        return categoryRepository.save(entity);
    }

    public  Category update(Long id, Category entity) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);

        if (optionalCategory.isEmpty()){
                throw new CategoryException("Category id "+ id + " does not exits");
        }
        try {
                Category category = optionalCategory.get();
                category.setName(entity.getName());
                category.setStatus(entity.getStatus());

                return categoryRepository.save(category);

        }catch (Exception ex){
            throw new CategoryException("Category is updated fail");
        }
    }

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Page<Category> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    public Category findById(Long id) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isEmpty()){
            throw new CategoryException("Category id "+ id + " does not exits");
        }
        return optionalCategory.get();
    }

    public void delete(Long id) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isEmpty()){
            throw new CategoryException("Category id "+ id + " does not exits");
        }
        categoryRepository.delete(optionalCategory.get());
    }
}
