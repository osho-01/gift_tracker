"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, User, Tag, Package } from "lucide-react"

interface FilterBarProps {
  recipients: { id: string; name: string }[]
  occasions: string[]
  onFilterChange: (filters: {
    recipient?: string
    occasion?: string
    purchased?: boolean
  }) => void
}

export function FilterBar({ recipients, occasions, onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState({
    recipient: "",
    occasion: "",
    purchased: undefined as boolean | undefined,
  })

  const handleFilterChange = (key: string, value: string | boolean | undefined) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      recipient: "",
      occasion: "",
      purchased: undefined,
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  // Update filters if recipients or occasions change
  useEffect(() => {
    // If the selected recipient or occasion no longer exists, reset it
    if (filters.recipient && filters.recipient !== "all" && !recipients.some((r) => r.id === filters.recipient)) {
      handleFilterChange("recipient", "")
    }

    if (filters.occasion && filters.occasion !== "all" && !occasions.includes(filters.occasion)) {
      handleFilterChange("occasion", "")
    }
  }, [recipients, occasions])

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 mr-2 text-primary" />
          <h3 className="font-medium">Filter Gifts</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center mb-2">
              <User className="h-4 w-4 mr-1 text-muted-foreground" />
              <Label className="text-sm">Recipient</Label>
            </div>
            <Select value={filters.recipient} onValueChange={(value) => handleFilterChange("recipient", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Recipients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Recipients</SelectItem>
                {recipients.map((recipient) => (
                  <SelectItem key={recipient.id} value={recipient.id}>
                    {recipient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
              <Label className="text-sm">Occasion</Label>
            </div>
            <Select value={filters.occasion} onValueChange={(value) => handleFilterChange("occasion", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Occasions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Occasions</SelectItem>
                {occasions.map((occasion) => (
                  <SelectItem key={occasion} value={occasion}>
                    {occasion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Package className="h-4 w-4 mr-1 text-muted-foreground" />
              <Label className="text-sm">Purchase Status</Label>
            </div>
            <div className="flex items-center space-x-2 h-10 px-3 rounded-md border border-input">
              <Switch
                id="purchased-filter"
                checked={filters.purchased === true}
                onCheckedChange={(checked) =>
                  handleFilterChange("purchased", checked ? true : filters.purchased === undefined ? false : undefined)
                }
              />
              <Label htmlFor="purchased-filter" className="text-sm">
                {filters.purchased === undefined
                  ? "All Items"
                  : filters.purchased
                    ? "Purchased Only"
                    : "Not Purchased Only"}
              </Label>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <Button variant="outline" onClick={handleClearFilters} className="w-full">
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

