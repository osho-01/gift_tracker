import { GiftTracker } from "@/components/gift-tracker"

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Gift Tracker</h1>
      <GiftTracker />
    </main>
  )
}

