import { Validators, ValidatorFn } from "@angular/forms"; // ValidatorFn : validationları aktarmak için

export const CategoryValidators = {
    name : () : ValidatorFn[] =>  [ 
        Validators.required,
        Validators.minLength(3)],

    description: (): ValidatorFn[] => [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
    ],
};