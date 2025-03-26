"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit2, Check, DollarSign } from "lucide-react"
import { toast } from "sonner"

interface BudgetEditorProps {
  initialBudget: number
  onBudgetChange: (newBudget: number) => void
}

export function BudgetEditor({ initialBudget, onBudgetChange }: BudgetEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [budget, setBudget] = useState(initialBudget)

  const handleSave = () => {
    onBudgetChange(budget)
    setIsEditing(false)
    toast.success("Budget updated", {
      description: `Your budget has been set to $${budget.toFixed(2)}`,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <DollarSign className="h-5 w-5 mr-1 text-primary" />
          Budget
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="max-w-[150px]"
                min={0}
                step={0.01}
              />
              <Button size="sm" variant="default" onClick={handleSave}>
                <Check className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <span className="text-xl font-semibold">${budget.toFixed(2)}</span>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

