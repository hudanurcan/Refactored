import { FormControl } from "@angular/forms";
import { ProductValidators } from "./ProductValidators"; 

export type baseProductForm = {
    productName: FormControl<string>;
    unitPrice : FormControl<number>;
    categoryId: FormControl<number | null>; // Selectbox için
};

export function baseProductForm() : baseProductForm {
    return {
        productName: new FormControl<string>('',{nonNullable:true, validators:ProductValidators.name()}),
        unitPrice: new FormControl<number>(0,{nonNullable:true,validators:ProductValidators.unitPrice()}),
        categoryId: new FormControl<number | null>(null)
    };
}