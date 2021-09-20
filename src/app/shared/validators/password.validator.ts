import {FormControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export class PasswordValidator {
  public static upperCase(control: FormControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const hasUpper = /[A-Z]/.test(control.value);
    return hasUpper ? null : { upperCase: true }
  }

  public static lowerCase(control: FormControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    let hasLower = /[a-z]/.test(control.value);
    return hasLower ? null : { lowerCase: true }
  }

  public static containFields(target: string, keys: string[]): ValidatorFn {
    return (group => {
      const targetField = group.get(target);
      if (!targetField) {
        return null;
      }
      let founded = false;
      keys.forEach(key => {
        const value = group.get(key)?.value;
        if (!value || !targetField.value?.toLowerCase().includes(value?.toLowerCase())) {
          return
        }
        founded = true;
      })
      return founded ? {include: true} : null
    })
  }
}
