"use client"

import { useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { Check, Edit, Trash2, X } from "lucide-react"

export function GiftList({ gifts, onEdit, onDelete, onTogglePurchased }) {
  const [showToast, setShowToast] = useState(false)

  const getDaysUntil = (dateString) => {
    const today = new Date()
    const occasionDate = new Date(dateString)
    const diffTime = occasionDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleDelete = (id) => {
    onDelete(id)
    setShowToast(true)

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  if (gifts.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground">No gifts found. Add a new gift to get started!</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto relative">
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
          <Check className="w-5 h-5 mr-2" /> Gift deleted successfully!
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Gift</th>
            <th className="text-left p-2 hidden md:table-cell">Recipient</th>
            <th className="text-left p-2 hidden md:table-cell">Occasion</th>
            <th className="text-left p-2 hidden md:table-cell">Date</th>
            <th className="text-right p-2">Price</th>
            <th className="text-center p-2">Purchase status</th>
            <th className="text-right p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {gifts.map((gift) => {
            const daysUntil = getDaysUntil(gift.date)
            const isUpcoming = daysUntil > 0 && daysUntil <= 30

            return (
              <tr key={gift.id} className="border-b hover:bg-muted/50">
                <td className="p-2">
                  <div>
                    <div className={gift.purchased ? "line-through text-muted-foreground" : ""}>{gift.name}</div>
                    <div className="text-sm text-muted-foreground md:hidden">
                      For: {gift.recipient} ({gift.occasion})
                    </div>
                  </div>
                </td>
                <td className="p-2 hidden md:table-cell">{gift.recipient}</td>
                <td className="p-2 hidden md:table-cell">{gift.occasion}</td>
                <td className="p-2 hidden md:table-cell">
                  <div className="flex flex-col">
                    <span>{new Date(gift.date).toLocaleDateString()}</span>
                    {isUpcoming && (
                      <span className="text-xs text-red-500 font-medium">
                        {daysUntil === 0 ? "Today!" : `${daysUntil} days left`}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-2 text-right">{formatCurrency(gift.price)}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => onTogglePurchased(gift.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      gift.purchased ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                    aria-label={gift.purchased ? "Mark as not purchased" : "Mark as purchased"}
                  >
                    {gift.purchased ? <Check size={16} /> : <X size={16} />}
                  </button>
                </td>
                <td className="p-2 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEdit(gift)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                      aria-label="Edit gift"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(gift.id)}
                      className="p-1 text-muted-foreground hover:text-red-500"
                      aria-label="Delete gift"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
