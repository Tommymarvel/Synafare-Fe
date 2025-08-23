'use client';
import React, { useState } from 'react';
import Money from '@/app/assets/Misc-icon.png';
import InventoryIcon from '@/app/assets/inventory-box.png';
import InStock from '@/app/assets/inStock-icon.png';
import OutOfStock from '@/app/assets/outStock-icon.png';
import Image from 'next/image';
import Inventory from './components/inventory';
import Catalogue, { CatelogueType } from './components/catalogue';
import { useInventory } from './hooks/useInventory';
import { useCatalogue } from './hooks/useCatalogue';
import Link from 'next/link';
import { fmtNaira } from '@/lib/format';
import AddCatalogueModal from './components/AddCatalogueModal';

const TABS = [
  { key: 'inventory', label: 'Inventory' },
  { key: 'catalogue', label: 'Catalogue' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabKey>('inventory');
  const [showAddCatalogueModal, setShowAddCatalogueModal] = useState(false);
  const [editingCatalogueItem, setEditingCatalogueItem] =
    useState<CatelogueType | null>(null);

  // Handle edit catalogue item
  const handleEditCatalogue = (item: CatelogueType) => {
    setEditingCatalogueItem(item);
    setShowAddCatalogueModal(true);
  };

  // Handle refresh catalogue data
  const handleRefreshCatalogue = () => {
    mutateCatalogue();
  };

  // Get inventory statistics for the dashboard cards
  const { meta } = useInventory({ limit: 1 }); // Just fetch one item to get the meta data

  // Get catalogue data
  const { data: catalogueData, mutate: mutateCatalogue } = useCatalogue();

  const stats = [
    {
      title: 'Total Stock Value',
      value: meta?.total_stock_value
        ? fmtNaira(meta.total_stock_value)
        : fmtNaira(0),
      icon: Money,
    },
    {
      title: 'Inventory',
      value: meta?.total_products || 0,
      icon: InventoryIcon,
    },
    {
      title: 'In Stock',
      value: meta?.total_in_stock || 0,
      icon: InStock,
    },
    {
      title: 'Out of Stock',
      value: meta?.total_declined || 0,
      icon: OutOfStock,
    },
  ];

  // Mock catalogue data for now - will be replaced with real data
  const CatlogueData = catalogueData.map((item) => ({
    id: item._id,
    product: item.product_name,
    category: item.category,
    dateCreated: new Date(item.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  }));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'catalogue':
        return (
          <Catalogue
            data={CatlogueData}
            onEdit={handleEditCatalogue}
            onRefresh={handleRefreshCatalogue}
          />
        );
      default:
        return <Inventory />;
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Inventory</h1>
        <button className="inline-flex items-center gap-2.5 px-3 py-2 bg-mikado text-raisin rounded-lg hover:bg-yellow-600">
          {activeTab === 'catalogue' ? (
            <button
              onClick={() => setShowAddCatalogueModal(true)}
              className="flex items-center gap-2"
            >
              <span className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10.8337 7.49984C10.8337 7.0396 10.4606 6.6665 10.0003 6.6665C9.54009 6.6665 9.16699 7.0396 9.16699 7.49984V9.1665H7.50033C7.04009 9.1665 6.66699 9.5396 6.66699 9.99984C6.66699 10.4601 7.04009 10.8332 7.50033 10.8332H9.16699V12.4998C9.16699 12.9601 9.54009 13.3332 10.0003 13.3332C10.4606 13.3332 10.8337 12.9601 10.8337 12.4998V10.8332H12.5003C12.9606 10.8332 13.3337 10.4601 13.3337 9.99984C13.3337 9.5396 12.9606 9.1665 12.5003 9.1665H10.8337V7.49984Z"
                    fill="#1D1C1D"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.0003 1.6665C5.39795 1.6665 1.66699 5.39746 1.66699 9.99984C1.66699 14.6022 5.39795 18.3332 10.0003 18.3332C14.6027 18.3332 18.3337 14.6022 18.3337 9.99984C18.3337 5.39746 14.6027 1.6665 10.0003 1.6665ZM3.33366 9.99984C3.33366 6.31794 6.31843 3.33317 10.0003 3.33317C13.6822 3.33317 16.667 6.31794 16.667 9.99984C16.667 13.6817 13.6822 16.6665 10.0003 16.6665C6.31843 16.6665 3.33366 13.6817 3.33366 9.99984Z"
                    fill="#1D1C1D"
                  />
                </svg>
              </span>
              <p className="text-sm">Add to Catalogue</p>
            </button>
          ) : (
            <Link
              href="/dashboard/inventory/add"
              className="flex items-center gap-2"
            >
              <span className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10.8337 7.49984C10.8337 7.0396 10.4606 6.6665 10.0003 6.6665C9.54009 6.6665 9.16699 7.0396 9.16699 7.49984V9.1665H7.50033C7.04009 9.1665 6.66699 9.5396 6.66699 9.99984C6.66699 10.4601 7.04009 10.8332 7.50033 10.8332H9.16699V12.4998C9.16699 12.9601 9.54009 13.3332 10.0003 13.3332C10.4606 13.3332 10.8337 12.9601 10.8337 12.4998V10.8332H12.5003C12.9606 10.8332 13.3337 10.4601 13.3337 9.99984C13.3337 9.5396 12.9606 9.1665 12.5003 9.1665H10.8337V7.49984Z"
                    fill="#1D1C1D"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.0003 1.6665C5.39795 1.6665 1.66699 5.39746 1.66699 9.99984C1.66699 14.6022 5.39795 18.3332 10.0003 18.3332C14.6027 18.3332 18.3337 14.6022 18.3337 9.99984C18.3337 5.39746 14.6027 1.6665 10.0003 1.6665ZM3.33366 9.99984C3.33366 6.31794 6.31843 3.33317 10.0003 3.33317C13.6822 3.33317 16.667 6.31794 16.667 9.99984C16.667 13.6817 13.6822 16.6665 10.0003 16.6665C6.31843 16.6665 3.33366 13.6817 3.33366 9.99984Z"
                    fill="#1D1C1D"
                  />
                </svg>
              </span>
              <p className="text-sm">Add to Inventory</p>
            </Link>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 mt-10 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <div
            key={i}
            className="rounded-md border border-gray-300 bg-white py-6 px-4 flex items-center justify-between"
          >
            <div className="space-y-1">
              <h3 className="text-[13px] font-medium text-gray-600">
                {item.title}
              </h3>
              <p className="text-[18px] font-semibold">{item.value}</p>
            </div>
            <div className="">
              <Image
                src={item.icon}
                alt={item.title}
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <nav className="flex gap-6 border-b mt-5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative pb-2 text-xs md:text-sm font-medium ${
                isActive
                  ? 'text-mikado border-b-2 border-mikado'
                  : 'text-[#797979] hover:text-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-5">{renderTabContent()}</div>

      {/* Add/Edit Catalogue Modal */}
      {showAddCatalogueModal && (
        <AddCatalogueModal
          initialData={editingCatalogueItem}
          onClose={() => {
            setShowAddCatalogueModal(false);
            setEditingCatalogueItem(null);
          }}
          onSuccess={() => {
            mutateCatalogue();
            setShowAddCatalogueModal(false);
            setEditingCatalogueItem(null);
          }}
        />
      )}
    </div>
  );
}
