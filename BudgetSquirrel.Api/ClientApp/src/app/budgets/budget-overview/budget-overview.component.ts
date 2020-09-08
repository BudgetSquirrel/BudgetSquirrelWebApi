import { Component, OnInit } from "@angular/core";
import { Budget, nullBudget } from '../models';
import { CreateBudgetEventArguments } from '../add-budget-form/add-budget-form.component';
import { EditBudgetEvent, EditBudgetFieldName } from '../budget/budget.component';
import { EditDurationEvent } from '../duration/edit-duration-form/edit-duration-form.component';
import { BudgetApi } from '../services/budget-api.service';

@Component({
  selector: "bs-budget-overview",
  templateUrl: "./budget-overview.component.html",
  styleUrls: ["./budget-overview.component.scss"]
})
export class BudgetOverviewComponent implements OnInit {

  public rootBudget: Budget = nullBudget;
  public isSubBudgetTotalPlannedAmountTooHigh: boolean;

  public isEditingRootName = false;
  public isEditingRootAmount = false;
  public isEditingDuration = false;

  public wasError = false;

  public parentBudgetForCreateBudget: Budget | null = null;

  get isAddingBudget(): boolean {
    return this.parentBudgetForCreateBudget != null;
  }

  constructor(private budgetService: BudgetApi) { }

  public ngOnInit() {
    this.loadRootBudget();
  }

  public onOpenInplaceEdit(field: string, event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }

    if (field === "setAmount") {
      this.isEditingRootAmount = true;
    } else if (field === "name") {
      this.isEditingRootName = true;
    }
  }

  public onEditBudget(event: EditBudgetEvent) {
    if (event.field === "setAmount") {
      this.budgetService.editBudgetSetAmount(event.budget, parseFloat(event.value)).then(response => {
        this.loadRootBudget();
      });
    } else if (event.field === "name") {
      if (!event.value) {
        return;
      }
      this.budgetService.editBudgetName(event.budget, event.value).then(response => {
        this.loadRootBudget();
      });
    }
  }

  public onBlurInplaceEdit(field: EditBudgetFieldName, event: MouseEvent) {
    const value = (event.target as HTMLInputElement).value;
    this.onEditBudget({
      budget: this.rootBudget,
      field,
      value
    });
    if (field === "setAmount") {
      this.isEditingRootAmount = false;
    } else if (field === "name") {
      this.isEditingRootName = false;
    }
  }

  public onAddBudgetClick(budget: Budget) {
    this.parentBudgetForCreateBudget = budget;
  }

  public onCloseAddBudgetModal() {
    this.parentBudgetForCreateBudget = null;
  }

  public onEditDurationClick() {
    this.isEditingDuration = true;
  }

  public onCloseDurationEditModal() {
    this.isEditingDuration = false;
  }

  public async onEditDurationSubmit(input: EditDurationEvent) {
    this.onCloseDurationEditModal();
    await this.budgetService.editDuration(this.rootBudget, {...input});
    await this.loadRootBudget();
  }

  public onSaveBudget(args: CreateBudgetEventArguments) {
    const self = this;
    this.budgetService.createBudget(args.parentBudget, args.name, args.setAmount).then(function() {
      self.loadRootBudget();
      self.parentBudgetForCreateBudget = null;
    });
  }

  public async onRemoveBudget(budget: Budget) {
    await this.budgetService.removeBudget(budget)
    this.loadRootBudget();
  }

  private loadRootBudget() {
    this.budgetService.getRootBudget().subscribe((rootBudget: Budget) => {
      this.rootBudget = rootBudget;
      this.syncRootBudgetState();
    }, (error) => {
      this.wasError = true;
    });
  }

  private syncRootBudgetState() {
    this.isSubBudgetTotalPlannedAmountTooHigh = this.rootBudget.subBudgetTotalPlannedAmount > this.rootBudget.setAmount;
  }
}
