"use client"

export function FilterControls({ filters, setFilters, recipients, occasions }) {
  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <h2 className="font-medium mb-3">Filter Gifts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="recipient-filter" className="block text-sm mb-1">
            Recipient
          </label>
          <select
            id="recipient-filter"
            value={filters.recipient}
            onChange={(e) => setFilters({ ...filters, recipient: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All Recipients</option>
            {recipients.map((recipient) => (
              <option key={recipient} value={recipient}>
                {recipient}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="occasion-filter" className="block text-sm mb-1">
            Occasion
          </label>
          <select
            id="occasion-filter"
            value={filters.occasion}
            onChange={(e) => setFilters({ ...filters, occasion: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All Occasions</option>
            {occasions.map((occasion) => (
              <option key={occasion} value={occasion}>
                {occasion}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status-filter" className="block text-sm mb-1">
            Status
          </label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Gifts</option>
            <option value="purchased">Purchased</option>
            <option value="not-purchased">Not Purchased</option>
          </select>
        </div>
      </div>
    </div>
  )
}

