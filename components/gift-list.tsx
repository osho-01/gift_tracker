"use client"

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, Gift, Calendar, User, Tag, DollarSign, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";

interface GiftProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  recipient: string;
  recipientName: string;
  occasion?: string;
  date?: Date;
  purchased: boolean;
}

interface GiftListProps {
  gifts: GiftProps[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePurchased: (id: string, purchased: boolean) => void;
  filteredBy?: string;
}

export function GiftList({ gifts, onEdit, onDelete, onTogglePurchased, filteredBy }: GiftListProps) {
  const [deleteGiftId, setDeleteGiftId] = useState<string | null>(null);

  return (
    <>
      {gifts.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Gift className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground font-medium">
              {filteredBy
                ? `No gifts found matching the current filters.`
                : `No gifts added yet. Add your first gift to get started.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {gifts.map((gift) => (
            <Card key={gift.id} className="w-full overflow-hidden transition-all hover:shadow-md">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold">{gift.name}</h3>
                          <Badge variant={gift.purchased ? "default" : "outline"} className="ml-2">
                            {gift.purchased ? (
                              <span className="flex items-center">
                                <Check className="h-3 w-3 mr-1" /> Purchased
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <X className="h-3 w-3 mr-1" /> Not Purchased
                              </span>
                            )}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <User className="h-3.5 w-3.5 mr-1" />
                          <p>For: {gift.recipientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(gift.id)} className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setDeleteGiftId(gift.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    {gift.description && <p className="mt-3 text-sm">{gift.description}</p>}

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-medium">Price:</span>
                        <span className="ml-1 break-all">${gift.price.toFixed(2)}</span>
                      </div>

                      {gift.occasion && (
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-medium">Occasion:</span>
                          <span className="ml-1 break-all">{gift.occasion}</span>
                        </div>
                      )}

                      {gift.date && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-medium">Date:</span>
                          <span className="ml-1">{format(new Date(gift.date), "PPP")}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="font-medium">Purchased:</span>
                        <Switch
                          checked={gift.purchased}
                          onCheckedChange={(checked) => onTogglePurchased(gift.id, checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {deleteGiftId && (
        <Dialog open={true} onOpenChange={() => setDeleteGiftId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <p>Do you really want to delete this gift? This action cannot be undone.</p>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteGiftId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(deleteGiftId);
                  setDeleteGiftId(null);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}