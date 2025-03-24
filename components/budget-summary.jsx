import { formatCurrency } from "@/lib/utils"

export function BudgetSummary({ gifts }) {
  const totalBudget = gifts.reduce((sum, gift) => sum + gift.price, 0)
  const spentBudget = gifts.filter((gift) => gift.purchased).reduce((sum, gift) => sum + gift.price, 0)
  const remainingBudget = totalBudget - spentBudget

  const percentSpent = totalBudget > 0 ? (spentBudget / totalBudget) * 100 : 0

  return (
    <div className="bg-card p-4 rounded-lg border w-full md:max-w-md">
      <h2 className="font-medium mb-2">Budget Summary</h2>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="font-medium">{formatCurrency(totalBudget)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Spent</p>
          <p className="font-medium text-green-600">{formatCurrency(spentBudget)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Remaining</p>
          <p className="font-medium text-blue-600">{formatCurrency(remainingBudget)}</p>
        </div>
      </div>

      <div className="w-full bg-muted rounded-full h-2.5">
        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${percentSpent}%` }}></div>
      </div>
      <p className="text-xs text-right mt-1 text-muted-foreground">{percentSpent.toFixed(0)}% of budget spent</p>
    </div>
  )
}

