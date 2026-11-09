export interface StockLevels {
  locationId: string
  onHand: number
  reserved: number
  safetyStock: number
}

export function availableStock(item: StockLevels): number {
  return item.onHand - item.reserved - item.safetyStock
}

/**
 * Chooses where to reserve from: the preferred location when it stocks the
 * listing, otherwise the location with the most available units.
 */
export function pickReservationItem<Item extends StockLevels>(
  items: Item[],
  preferredLocationId?: string
): Item | undefined {
  const preferred = items.find(
    (item) => item.locationId === preferredLocationId
  )
  if (preferred) {
    return preferred
  }

  return [...items].sort((a, b) => availableStock(b) - availableStock(a))[0]
}
