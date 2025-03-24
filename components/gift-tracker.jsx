"use client"

import { useState } from "react"
import { GiftList } from "@/components/gift-list"
import { GiftForm } from "@/components/gift-form"
import { FilterControls } from "@/components/filter-controls"
import { BudgetSummary } from "@/components/budget-summary"

export function GiftTracker() {
  const [gifts, setGifts] = useState([
    {
      id: "1",
      recipient: "Mom",
      occasion: "Birthday",
      name: "Scented Candle Set",
      price: 25.99,
      purchased: false,
      notes: "She likes vanilla scents",
      date: "2025-05-15",
    },
    {
      id: "2",
      recipient: "Dad",
      occasion: "Father's Day",
      name: "Grilling Tool Set",
      price: 49.99,
      purchased: true,
      notes: "The one with wooden handles",
      date: "2025-06-20",
    },
    {
      id: "3",
      recipient: "Sarah",
      occasion: "Christmas",
      name: "Wireless Headphones",
      price: 89.99,
      purchased: false,
      notes: "She mentioned the Sony ones",
      date: "2025-12-25",
    },
  ])

  const [filters, setFilters] = useState({
    recipient: "",
    occasion: "",
    status: "all",
  })

  const [editingGift, setEditingGift] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const addGift = (gift) => {
    const newGift = {
      ...gift,
      id: Date.now().toString(),
    }
    setGifts([...gifts, newGift])
    setIsFormOpen(false)
  }

  const updateGift = (updatedGift) => {
    setGifts(gifts.map((gift) => (gift.id === updatedGift.id ? updatedGift : gift)))
    setEditingGift(null)
    setIsFormOpen(false)
  }

  const deleteGift = (id) => {
    setGifts(gifts.filter((gift) => gift.id !== id))
  }

  const togglePurchased = (id) => {
    setGifts(gifts.map((gift) => (gift.id === id ? { ...gift, purchased: !gift.purchased } : gift)))
  }

  const filteredGifts = gifts.filter((gift) => {
    const matchesRecipient = !filters.recipient || gift.recipient === filters.recipient
    const matchesOccasion = !filters.occasion || gift.occasion === filters.occasion
    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "purchased" && gift.purchased) ||
      (filters.status === "not-purchased" && !gift.purchased)

    return matchesRecipient && matchesOccasion && matchesStatus
  })

  const uniqueRecipients = Array.from(new Set(gifts.map((gift) => gift.recipient)))
  const uniqueOccasions = Array.from(new Set(gifts.map((gift) => gift.occasion)))

  const openEditForm = (gift) => {
    setEditingGift(gift)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <BudgetSummary gifts={gifts} />
        <button
          onClick={() => {
            setEditingGift(null)
            setIsFormOpen(true)
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          Add New Gift
        </button>
      </div>

      <FilterControls
        filters={filters}
        setFilters={setFilters}
        recipients={uniqueRecipients}
        occasions={uniqueOccasions}
      />

      {isFormOpen ? (
        <GiftForm
          onSubmit={editingGift ? updateGift : addGift}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingGift(null)
          }}
          initialData={editingGift}
          recipients={uniqueRecipients}
          occasions={uniqueOccasions}
        />
      ) : (
        <GiftList
          gifts={filteredGifts}
          onEdit={openEditForm}
          onDelete={deleteGift}
          onTogglePurchased={togglePurchased}
        />
      )}
    </div>
  )
}

