import { format } from 'date-fns';
import { useInventoryActivity, type InventoryActivityType } from '../../hooks';

interface ProductActivityProps {
  inventoryId: string;
}

export default function ProductActivity({ inventoryId }: ProductActivityProps) {
  const { activities, isLoading, error } = useInventoryActivity(inventoryId);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-x-3">
              <div className="w-4 h-4 bg-gray-200 rounded-full flex-shrink-0 mt-1"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center text-red-600">
          <p>Failed to load product activity</p>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Activity
          </h3>
          <p className="text-gray-500">
            No activity recorded for this product yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-6">
        {activities.map((activity: InventoryActivityType, index: number) => (
          <div key={activity._id} className="flex gap-x-3">
            {/* Timeline dot and line */}
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-gray-400 rounded-full flex-shrink-0"></div>
              {index < activities.length - 1 && (
                <div className="w-px h-12 bg-gray-200 mt-2"></div>
              )}
            </div>

            {/* Activity content */}
            <div className="flex-1 min-w-0">
              <div className="pb-4 border-b border-gray-100 last:border-b-0">
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  {activity.desc}
                </h4>
                <p className="text-xs text-gray-500">
                  {format(
                    new Date(activity.createdAt),
                    "MMM d, yyyy 'at' h:mm a"
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
