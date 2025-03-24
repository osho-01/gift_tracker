"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function GiftForm({ onSubmit, onCancel, initialData, recipients, occasions }) {
  const [formData, setFormData] = useState({
    recipient: initialData?.recipient || "",
    occasion: initialData?.occasion || "",
    name: initialData?.name || "",
    price: initialData?.price || 0,
    purchased: initialData?.purchased || false,
    notes: initialData?.notes || "",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    ...(initialData?.id ? { id: initialData.id } : {}),
  })

  const [newRecipient, setNewRecipient] = useState("")
  const [newOccasion, setNewOccasion] = useState("")
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "price" ? Number.parseFloat(value) || 0 : value,
    })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Gift name is required"
    }

    if (!formData.recipient.trim()) {
      newErrors.recipient = "Recipient is required"
    }

    if (!formData.occasion.trim()) {
      newErrors.occasion = "Occasion is required"
    }

    if (formData.price < 0) {
      newErrors.price = "Price cannot be negative"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }
  const [localRecipients, setLocalRecipients] = useState(recipients);

  const handleAddRecipient = () => {
    if (newRecipient.trim() && !localRecipients.includes(newRecipient.trim())) {
      setLocalRecipients([...localRecipients, newRecipient.trim()]);

      // Update form data
      setFormData((prev) => ({
        ...prev,
        recipient: newRecipient.trim(),
      }));

      setNewRecipient("");
    }
  };

  const handleAddOccasion = () => {
    if (newOccasion.trim() && !occasions.includes(newOccasion.trim())) {
      setFormData({
        ...formData,
        occasion: newOccasion.trim(),
      })
      setNewOccasion("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-card">
      <h2 className="text-xl font-semibold mb-4">{initialData ? "Edit Gift" : "Add New Gift"}</h2>

      <div className="space-y-2">
        <Label htmlFor="name">Gift Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter gift name"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient</Label>
          <div className="flex gap-2">
            <select
              id="recipient"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
            >
              <option value="">Select recipient</option>
              {localRecipients.map((recipient) => (
                <option key={recipient} value={recipient}>
                  {recipient}
                </option>
              ))}
              <option value="__new__">+ Add new recipient</option>
            </select>
          </div>
          {formData.recipient === "__new__" && (
            <div className="flex gap-2 mt-2">
              <Input
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                placeholder="New recipient name"
              />
              <button
                type="button"
                onClick={handleAddRecipient}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Add
              </button>
            </div>
          )}
          {errors.recipient && <p className="text-red-500 text-sm">{errors.recipient}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="occasion">Occasion</Label>
          <div className="flex gap-2">
            <select
              id="occasion"
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.occasion ? "border-red-500" : ""
                }`}
            >
              <option value="">Select occasion</option>
              {occasions.map((occasion) => (
                <option key={occasion} value={occasion}>
                  {occasion}
                </option>
              ))}
              <option value="__new__">+ Add new occasion</option>
            </select>
          </div>
          {formData.occasion === "__new__" && (
            <div className="flex gap-2 mt-2">
              <Input
                value={newOccasion}
                onChange={(e) => setNewOccasion(e.target.value)}
                placeholder="New occasion name"
              />
              <button
                type="button"
                onClick={handleAddOccasion}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Add
              </button>
            </div>
          )}
          {errors.occasion && <p className="text-red-500 text-sm">{errors.occasion}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            className={errors.price ? "border-red-500" : ""}
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? "border-red-500" : ""}
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="purchased"
          checked={formData.purchased}
          onCheckedChange={(checked) => setFormData({ ...formData, purchased: checked })}
        />
        <Label htmlFor="purchased">Already purchased</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any notes about this gift..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md hover:bg-muted">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          {initialData ? "Update Gift" : "Add Gift"}
        </button>
      </div>
    </form>
  )
}

