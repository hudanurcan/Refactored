import { Validators, ValidatorFn } from "@angular/forms"; // ValidatorFn : validationları aktarmak için

export const ProductValidators = {
    name : () : ValidatorFn[] =>  [ 
        Validators.required,
        Validators.minLength(3)],

    unitPrice: (): ValidatorFn[] => [
        Validators.required,
        Validators.min(1)
    ],
};