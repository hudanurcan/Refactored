import { Component,signal,inject,OnInit, destroyPlatform } from '@angular/core';
import { AbstractControl,ReactiveFormsModule } from '@angular/forms';
import { ProductApi } from '../../DataAccess/product-api';
import { CategoryApi } from '../../DataAccess/category-api';
import { ProductResponseModel } from '../../Models/Products/ProductResponseModel';
import { createProductForm, toCreateProductRequest } from '../../Validations/Products/CreateProductFormFactory';
import { updateProductForm, toUpdateProductRequest } from '../../Validations/Products/UpdateProductFormFactory';
import { CategoryResponseModel } from '../../Models/Categories/CategoryResponseModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-operation',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './product-operation.html',
  styleUrl: './product-operation.css',
})
export class ProductOperation implements OnInit{
  private productApi = inject(ProductApi);
  private categoryApi = inject(CategoryApi);

  protected products = signal<ProductResponseModel[]>([]);
  protected selectedProduct = signal<ProductResponseModel|null>(null);
  protected categories = signal<CategoryResponseModel[]>([]); // Dinamik kategori listesi

  // UI state formları

  protected createForm = createProductForm();
  protected updateForm = updateProductForm();

  private async refreshProducts() : Promise<void> {
    try {
   const [productValues, categoryValues] = await Promise.all([
    this.productApi.getAll(),
    this.categoryApi.getAll()
  ]);
  
  this.products.set(productValues);
  this.categories.set(categoryValues); // Kategoriler dinamik olarak set edildi

    }catch(error) {
      console.log("Ürün listesi alınamadı", error);
    }
  }

  async ngOnInit(): Promise<void> {
    await this.refreshProducts();
  }

  // create işlemleri

  async onCreate(): Promise<void> {
    if(this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const req = toCreateProductRequest(this.createForm);
    await this.productApi.create(req);
    this.createForm.reset();
    await this.refreshProducts();
  }

  //Update işlemleri
  startUpdate(pro:ProductResponseModel) {
    this.selectedProduct.set(pro);

    this.updateForm.patchValue({
      id:pro.id,
      productName:pro.productName,
      unitPrice:pro.unitPrice,
      categoryId: pro.categoryId,
    },
    {emitEvent:false}
    );
  }

  cancelUpdate() {
    this.selectedProduct.set(null);
    this.updateForm.reset({id:0, productName:'0', unitPrice: 0, categoryId: 0});
  }

  async onUpdate() {
    if(this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    const req = toUpdateProductRequest(this.updateForm);
    await this.productApi.update(req);
    this.cancelUpdate();
    await this.refreshProducts();
  }

  //delete

  async onDelete(id:number):Promise<void> {
    const confimDelete = window.confirm (
     `ID'si ${id} olan kategoriyi silmek istediğinize emin misiniz ?`

    );

    if(!confimDelete) {
      return;
    }

    try{
      const message = await this.productApi.deleteById(id);
      console.log('Delete mesajı', message);

      this.products.update((x) => x.filter((p) => p.id !== id));

      const selected = this.selectedProduct();
      if(selected && selected.id === id) {
        this.selectedProduct.set(null);
      }

    }catch(error){
      console.log(error);

    }
  }

  protected labels:Record<string,string> = {
    productName: 'Ürün Adı',
    unitPrice : 'Fiyat',
    categoryId : 'Kategori Id',
    id: 'Id',
  };

  protected getErrorMessage(control:AbstractControl|null,label='bu alan'):string|null {
    if(!control || (!control.touched && !control.dirty) || !control.invalid) {
      return null;
    }
    else if(control?.hasError('required')) {
      return `${label} zorunludur`;
    }
    else if(control.hasError('minlength')) {
      const e = control.getError('minlength'); // requiredlength, actualLength
      return `${label} en az ${e.requiredLength} karakter olmalıdır`;
    }
    else if(control.hasError('maxlength')) {
      const e = control.getError('maxlength');
      return `${label} en fazla ${e.requiredLength} karakter olmalıdır`;
    }
    return `${label} geçersiz`;
  }  

  protected getErrorMessageByName(form:{controls:Record<string,AbstractControl>},controlName:string) : string | null {
    const control = form.controls[controlName];
    const label = this.labels[controlName] ?? controlName;

    return this.getErrorMessage(control,label);
  }
}
