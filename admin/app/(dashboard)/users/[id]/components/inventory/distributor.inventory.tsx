import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CatelogueType, DInventoryDataType } from '@/types/usertypes';
import DistEmbededInventory from './distributor.inv.inv';
import InstallerInventory from './installer.inventory';
// import CardWrapper from "@/components/cardWrapper";
// import EmptyList from "@/app/(dashboard)/loan-requests/components/empty-list";

const DistributorInventory = ({
  catalogueData,
  inventoryData,
  ownerUserId,
}: {
  catalogueData: CatelogueType[];
  inventoryData: DInventoryDataType[];
  ownerUserId: string;
}) => {
  return (
    <Tabs defaultValue="inventory" className="w-full space-y-5">
      <TabsList className=" rounded-none flex gap-x-[11px]">
        <TabsTrigger
          asChild
          className="p-4 cursor-pointer border border-border-gray"
          value="inventory"
        >
          <button className=" block border-gray-300 text-gray-3 border py-2 px-3 font-medium rounded-md data-[state=active]:border-none data-[state=active]:bg-[#FFF8E2] data-[state=active]:text-[#E2A109]">
            Inventory
          </button>
        </TabsTrigger>
        <TabsTrigger
          asChild
          className="p-4 cursor-pointer border border-border-gray"
          value="catalogue"
        >
          <button className=" block border-gray-300 text-gray-3 border py-2 px-3 font-medium rounded-md data-[state=active]:border-none data-[state=active]:bg-[#FFF8E2] data-[state=active]:text-[#E2A109]">
            Catalogue{' '}
          </button>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="inventory">
        <DistEmbededInventory data={inventoryData} ownerUserId={ownerUserId} />
      </TabsContent>
      <TabsContent value="catalogue">
        {/* the catalogue of the distributor is the same as the inventory of the installer */}
        <InstallerInventory data={catalogueData} />
      </TabsContent>
    </Tabs>
  );
};

export default DistributorInventory;
