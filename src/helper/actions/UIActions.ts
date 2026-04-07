import { PageActions } from './PageActions';
import { UIElementActions } from './UIElementActions';
import { EditBoxActions } from './EditBoxActions';
import { DropDownActions } from './DropDownActions';
import { CheckboxActions } from './CheckboxActions';

/**
 * UIActions - Thin facade that groups stateless UI helpers under one entry point.
 */
export class UIActions {
  public readonly element: UIElementActions;
  public readonly editBox: EditBoxActions;
  public readonly dropdown: DropDownActions;
  public readonly checkbox: CheckboxActions;

  constructor(pageActions: PageActions) {
    this.element = new UIElementActions(pageActions);
    this.editBox = new EditBoxActions(pageActions);
    this.dropdown = new DropDownActions(pageActions);
    this.checkbox = new CheckboxActions(pageActions);
  }
}
