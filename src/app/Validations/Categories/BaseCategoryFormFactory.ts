import { FormControl } from "@angular/forms";
import { CategoryValidators } from "./CategoryValidators";

export type baseCategoryForm = {
    name: FormControl<string>;
    description : FormControl<string>;
};

export function baseCategoryForm() : baseCategoryForm {
    return {
        name: new FormControl<string>('',{nonNullable:true, validators:CategoryValidators.name()}),
        description: new FormControl<string>('',{nonNullable:true,validators:CategoryValidators.description()}),
    };
}