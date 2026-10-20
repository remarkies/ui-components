import { UiButton } from './button/button';
import { UiCheckbox } from './checkbox/checkbox';
import { UiFileInput } from './file-input/file-input';
import { UiFormField } from './form-field/form-field';
import { UiInput } from './input/input';
import { UiModal, UiModalFooter } from './modal/modal';
import { UiRadio, UiRadioGroup } from './radio/radio';
import { UiSlider } from './slider/slider';
import { UiSwitch } from './switch/switch';
import { UiCellDef, UiTable } from './table/table';

/** Every component and directive, for `imports: [UI_COMPONENTS]`. */
export const UI_COMPONENTS = [
  UiButton,
  UiFormField,
  UiInput,
  UiCheckbox,
  UiRadioGroup,
  UiRadio,
  UiSwitch,
  UiSlider,
  UiFileInput,
  UiModal,
  UiModalFooter,
  UiTable,
  UiCellDef,
] as const;
