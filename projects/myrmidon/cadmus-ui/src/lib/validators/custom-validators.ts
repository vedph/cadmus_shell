import {
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';

// https://www.tektutorialshub.com/angular/custom-validator-with-parameters-in-angular/

/**
 * General-purpose custom validators.
 */
// https://github.com/angular/angular/issues/18867#issuecomment-357484102
// @dynamic
export class CustomValidators {
  /**
   * Validates a FormGroup or FormArray control checking if the count of their
   * controls with a true value is equal to or greater than the specified
   * number.
   *
   * @param min The minimum number of checked controls.
   */
  public static minChecked(min = 1): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // https://trungk18.com/experience/angular-form-array-validate-at-least-one-checkbox-was-selected/
      let checked = 0;

      const group = control as FormGroup;
      Object.keys(group.controls).forEach((key) => {
        const ctl = group.controls[key];
        if (ctl.value === true) {
          checked++;
        }
      });

      if (checked < min) {
        return {
          minChecked: true,
        };
      }
      return null;
    };
  }
}
