import CategoriesPage from "./categories/page";

export default function Home() {
  return (
    <div className="px-6 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600">
          Welcome to Bidsphere UI
        </h1>
        <p className="text-gray-600 mt-2">Buy & Sell Categories</p>
      </div>

      {/* Categories Section */}
      <CategoriesPage />
    </div>
  );
}
