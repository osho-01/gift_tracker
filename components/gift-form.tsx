"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, DollarSign, User, CalendarPlus2Icon as CalendarIcon2, Tag, FileText, Plus } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { v4 as uuidv4 } from "uuid"
import { Label } from "@/components/ui/label"

const giftFormSchema = z.object({
  name: z.string().min(2, {
    message: "Gift name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  recipient: z.string().min(1, {
    message: "Please select a recipient.",
  }),
  occasion: z.string().optional(),
  date: z.date().optional(),
  purchased: z.boolean().default(false),
})

type GiftFormValues = z.infer<typeof giftFormSchema>

interface GiftFormProps {
  defaultValues?: Partial<GiftFormValues>
  recipients: { id: string; name: string }[]
  occasions: string[]
  onSubmit: (data: GiftFormValues) => void
  onCancel: () => void
  onAddRecipient?: (recipient: { id: string; name: string }) => void
  onAddOccasion?: (occasion: string) => void
}

export function GiftForm({
  defaultValues,
  recipients,
  occasions,
  onSubmit,
  onCancel,
  onAddRecipient,
  onAddOccasion,
}: GiftFormProps) {
  const [isAddRecipientOpen, setIsAddRecipientOpen] = useState(false)
  const [isAddOccasionOpen, setIsAddOccasionOpen] = useState(false)
  const [newRecipientName, setNewRecipientName] = useState("")
  const [newOccasion, setNewOccasion] = useState("")

  const form = useForm<GiftFormValues>({
    resolver: zodResolver(giftFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      recipient: "",
      occasion: "",
      date: undefined,
      purchased: false,
      ...defaultValues,
    },
  })

  const handleAddRecipient = () => {
    if (newRecipientName.trim() && onAddRecipient) {
      const newRecipient = {
        id: uuidv4(),
        name: newRecipientName.trim(),
      }
      onAddRecipient(newRecipient)
      form.setValue("recipient", newRecipient.id)
      setNewRecipientName("")
      setIsAddRecipientOpen(false)
    }
  }

  const handleAddOccasion = () => {
    if (newOccasion.trim() && onAddOccasion) {
      onAddOccasion(newOccasion.trim())
      form.setValue("occasion", newOccasion.trim())
      setNewOccasion("")
      setIsAddOccasionOpen(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-primary" />
                  Gift Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter gift name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter gift description (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-primary" />
                  Price
                </FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={0.01} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recipient"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  Recipient
                </FormLabel>
                <div className="flex gap-2">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {recipients.map((recipient) => (
                        <SelectItem key={recipient.id} value={recipient.id}>
                          {recipient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" size="icon" onClick={() => setIsAddRecipientOpen(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="occasion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <CalendarIcon2 className="h-4 w-4 mr-2 text-primary" />
                  Occasion
                </FormLabel>
                <div className="flex gap-2">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select occasion (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {occasions.map((occasion) => (
                        <SelectItem key={occasion} value={occasion}>
                          {occasion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" size="icon" onClick={() => setIsAddOccasionOpen(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                  Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date (optional)</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchased"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Purchased</FormLabel>
                  <FormDescription>Mark this gift as purchased</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{defaultValues?.name ? "Update" : "Add"} Gift</Button>
          </div>
        </form>
      </Form>

      {/* Add Recipient Dialog */}
      <Dialog open={isAddRecipientOpen} onOpenChange={setIsAddRecipientOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Recipient</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="new-recipient">
                Name
              </Label>
              <Input
                id="new-recipient"
                value={newRecipientName}
                onChange={(e) => setNewRecipientName(e.target.value)}
                className="col-span-3"
                placeholder="Enter recipient name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddRecipientOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddRecipient} disabled={!newRecipientName.trim()}>
              Add Recipient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Occasion Dialog */}
      <Dialog open={isAddOccasionOpen} onOpenChange={setIsAddOccasionOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Occasion</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="new-occasion">
                Occasion
              </Label>
              <Input
                id="new-occasion"
                value={newOccasion}
                onChange={(e) => setNewOccasion(e.target.value)}
                className="col-span-3"
                placeholder="Enter occasion name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddOccasionOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddOccasion} disabled={!newOccasion.trim()}>
              Add Occasion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

