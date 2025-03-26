"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GiftForm } from "@/components/gift-form"
import { GiftList } from "@/components/gift-list"
import { FilterBar } from "@/components/filter-bar"
import { BudgetEditor } from "@/components/budget-editor"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Gift } from "lucide-react"
import { Toaster } from "sonner"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { v4 as uuidv4 } from "uuid"

// Initial data
const INITIAL_RECIPIENTS = [
  { id: "1", name: "Mom" },
  { id: "2", name: "Dad" },
  { id: "3", name: "Sister" },
  { id: "4", name: "Brother" },
  { id: "5", name: "Friend" },
]

const INITIAL_OCCASIONS = [
  "Birthday",
  "Christmas",
  "Anniversary",
  "Graduation",
  "Wedding",
  "Baby Shower",
  "Housewarming",
]

interface GiftInterface {
  id: string
  name: string
  description?: string
  price: number
  recipient: string
  recipientName: string
  occasion?: string
  date?: Date
  purchased: boolean
}

export default function Home() {
  const [gifts, setGifts] = useState<GiftInterface[]>([])
  const [filteredGifts, setFilteredGifts] = useState<GiftInterface[]>([])
  const [budget, setBudget] = useState(500)
  const [recipients, setRecipients] = useState(INITIAL_RECIPIENTS)
  const [occasions, setOccasions] = useState(INITIAL_OCCASIONS)
  const [isAddGiftOpen, setIsAddGiftOpen] = useState(false)
  const [editingGift, setEditingGift] = useState<GiftInterface | null>(null)
  const [activeFilters, setActiveFilters] = useState<{
    recipient?: string
    occasion?: string
    purchased?: boolean
  }>({})
  const [activeFiltersText, setActiveFiltersText] = useState<string | undefined>(undefined)
  const [deletedGifts, setDeletedGifts] = useState<{ gift: GiftInterface; timestamp: number }[]>([])

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedGifts = localStorage.getItem("gifts")
    const savedBudget = localStorage.getItem("budget")
    const savedRecipients = localStorage.getItem("recipients")
    const savedOccasions = localStorage.getItem("occasions")

    if (savedGifts) {
      const parsedGifts = JSON.parse(savedGifts)
      // Convert date strings back to Date objects
      const processedGifts = parsedGifts.map((gift: any) => ({
        ...gift,
        date: gift.date ? new Date(gift.date) : undefined,
      }))
      setGifts(processedGifts)
      setFilteredGifts(processedGifts)
    }

    if (savedBudget) {
      setBudget(Number(savedBudget))
    }

    if (savedRecipients) {
      setRecipients(JSON.parse(savedRecipients))
    }

    if (savedOccasions) {
      setOccasions(JSON.parse(savedOccasions))
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("gifts", JSON.stringify(gifts))
  }, [gifts])

  useEffect(() => {
    localStorage.setItem("budget", budget.toString())
  }, [budget])

  useEffect(() => {
    localStorage.setItem("recipients", JSON.stringify(recipients))
  }, [recipients])

  useEffect(() => {
    localStorage.setItem("occasions", JSON.stringify(occasions))
  }, [occasions])

  // Apply filters whenever gifts or active filters change
  useEffect(() => {
    applyFilters(activeFilters)
  }, [gifts, activeFilters])

  const handleAddGift = (data: any) => {
    const newGift = {
      id: uuidv4(),
      ...data,
      recipientName: recipients.find((r) => r.id === data.recipient)?.name || "Unknown",
    }

    setGifts((prev) => [...prev, newGift])
    setIsAddGiftOpen(false)
    toast.success("Gift added successfully", {
      description: `${newGift.name} has been added to your gift list.`,
      duration: 3000,
    })
  }

  const handleEditGift = (data: any) => {
    if (!editingGift) return

    const updatedGift = {
      ...data,
      id: editingGift.id,
      recipientName: recipients.find((r) => r.id === data.recipient)?.name || "Unknown",
    }

    setGifts((prev) => prev.map((gift) => (gift.id === editingGift.id ? updatedGift : gift)))
    setEditingGift(null)
    toast.success("Gift updated successfully", {
      description: `${updatedGift.name} has been updated.`,
      duration: 3000,
    })
  }

  const handleDeleteGift = (id: string) => {
    const giftToDelete = gifts.find((gift) => gift.id === id)
    if (!giftToDelete) return

    // Remove the gift from the list
    setGifts((prev) => prev.filter((gift) => gift.id !== id))

    // Add to deleted gifts with timestamp
    const deletedGift = {
      gift: giftToDelete,
      timestamp: Date.now(),
    }
    setDeletedGifts((prev) => [...prev, deletedGift])

    // Show toast with undo button
    toast.error(`Gift deleted`, {
      description: `"${giftToDelete.name}" has been removed.`,
      duration: 5000,
      action: {
        label: "Undo",
        onClick: () => {
          // Restore the gift when undo is clicked
          setGifts((prev) => [...prev, giftToDelete])
          // Remove from deleted gifts
          setDeletedGifts((prev) => prev.filter((item) => item.gift.id !== id))
          toast.success(`Gift restored`, {
            description: `"${giftToDelete.name}" has been added back to your list.`,
          })
        },
      },
    })
  }

  const handleTogglePurchased = (id: string, purchased: boolean) => {
    const giftToUpdate = gifts.find((gift) => gift.id === id)
    if (!giftToUpdate) return

    setGifts((prev) => prev.map((gift) => (gift.id === id ? { ...gift, purchased } : gift)))

    toast.success(`Gift marked as ${purchased ? "purchased" : "not purchased"}`, {
      description: `${giftToUpdate.name} has been updated.`,
      duration: 3000,
    })
  }

  const handleAddRecipient = (recipient: { id: string; name: string }) => {
    setRecipients((prev) => [...prev, recipient])
    toast.success("Recipient added", {
      description: `${recipient.name} has been added to your recipients.`,
      duration: 3000,
    })
  }

  const handleAddOccasion = (occasion: string) => {
    setOccasions((prev) => [...prev, occasion])
    toast.success("Occasion added", {
      description: `${occasion} has been added to your occasions.`,
      duration: 3000,
    })
  }

  const applyFilters = (filters: { recipient?: string; occasion?: string; purchased?: boolean }) => {
    let filtered = [...gifts]
    const activeFilterText: string[] = []

    if (filters.recipient && filters.recipient !== "all") {
      filtered = filtered.filter((gift) => gift.recipient === filters.recipient)
      const recipientName = recipients.find((r) => r.id === filters.recipient)?.name
      if (recipientName) activeFilterText.push(`Recipient: ${recipientName}`)
    }

    if (filters.occasion && filters.occasion !== "all") {
      filtered = filtered.filter((gift) => gift.occasion === filters.occasion)
      activeFilterText.push(`Occasion: ${filters.occasion}`)
    }

    if (filters.purchased !== undefined) {
      filtered = filtered.filter((gift) => gift.purchased === filters.purchased)
      activeFilterText.push(`Status: ${filters.purchased ? "Purchased" : "Not Purchased"}`)
    }

    setFilteredGifts(filtered)
    setActiveFiltersText(activeFilterText.length > 0 ? activeFilterText.join(", ") : undefined)
  }

  const handleFilterChange = (filters: { recipient?: string; occasion?: string; purchased?: boolean }) => {
    setActiveFilters(filters)
  }

  const totalSpent = gifts.filter((gift) => gift.purchased).reduce((sum, gift) => sum + gift.price, 0)

  const remainingBudget = budget - totalSpent

  return (
    <main className="container mx-auto py-8 px-4 min-h-screen bg-background">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center mb-2">
            <Gift className="h-8 w-8 mr-2 text-primary" />
            <h1 className="text-3xl font-bold">Gift Tracker</h1>
          </div>
          <p className="text-muted-foreground">Keep track of your gift ideas, budget, and purchases</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <BudgetEditor initialBudget={budget} onBudgetChange={setBudget} />

          <Card className="w-full col-span-1 md:col-span-2">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-lg font-medium">Total Spent: ${totalSpent.toFixed(2)}</p>
                  <p className={`text-sm ${remainingBudget < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                    Remaining: ${remainingBudget.toFixed(2)}
                  </p>
                </div>
                <Button onClick={() => setIsAddGiftOpen(true)} className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" /> Add Gift
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <FilterBar recipients={recipients} occasions={occasions} onFilterChange={handleFilterChange} />

          {activeFiltersText && (
            <div className="text-sm text-muted-foreground px-1">Filtering by: {activeFiltersText}</div>
          )}

          <GiftList
            gifts={filteredGifts}
            onEdit={(id) => setEditingGift(gifts.find((g) => g.id === id) || null)}
            onDelete={handleDeleteGift}
            onTogglePurchased={handleTogglePurchased}
            filteredBy={activeFiltersText}
          />
        </div>

        <Dialog open={isAddGiftOpen} onOpenChange={setIsAddGiftOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Gift</DialogTitle>
            </DialogHeader>
            <GiftForm
              recipients={recipients}
              occasions={occasions}
              onSubmit={handleAddGift}
              onCancel={() => setIsAddGiftOpen(false)}
              onAddRecipient={handleAddRecipient}
              onAddOccasion={handleAddOccasion}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingGift} onOpenChange={(open) => !open && setEditingGift(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Gift</DialogTitle>
            </DialogHeader>
            {editingGift && (
              <GiftForm
                defaultValues={{
                  name: editingGift.name,
                  description: editingGift.description,
                  price: editingGift.price,
                  recipient: editingGift.recipient,
                  occasion: editingGift.occasion,
                  date: editingGift.date,
                  purchased: editingGift.purchased,
                }}
                recipients={recipients}
                occasions={occasions}
                onSubmit={handleEditGift}
                onCancel={() => setEditingGift(null)}
                onAddRecipient={handleAddRecipient}
                onAddOccasion={handleAddOccasion}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Toaster position="top-center" richColors closeButton />
    </main>
  )
}

