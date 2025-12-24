import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UpdateProductRequestModel } from "../../Models/Products/UpdateProductRequestModel"; 
import { baseProductForm } from "./BaseProductFormFactory";

export type UpdateProductForm = FormGroup<{
    id: FormControl<number>;
    productName: FormControl<string>;
    unitPrice: FormControl<number>;
    categoryId: FormControl<number | null>;
}>;

export function updateProductForm() {
    const base = baseProductForm();


    base.productName.addValidators([Validators.maxLength(50)]);

    base.productName.updateValueAndValidity({emitEvent:false});


        return new FormGroup({
            id: new FormControl(0, {
                nonNullable: true,
                validators: [Validators.required, Validators.min(1)],
            }),
            ...base,
        });
}

export function toUpdateProductRequest(form:UpdateProductForm) : UpdateProductRequestModel {
    return {
        id : form.controls.id.value,
        productName: form.controls.productName.value,
        unitPrice: form.controls.unitPrice.value,
        categoryId :form.controls.categoryId.value,
    };
}