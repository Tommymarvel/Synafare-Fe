import CardWrapper from "@/components/cardWrapper";
import GoBack from "@/components/goback";
import Status from "@/components/status";
import InfoDetail from "../../../loan-requests/[id]/components/detail";
import ProductCarousel from "./components/carousel";
import OrderHistor from "./components/order.history";
import { customerInvoices } from "@/data/users.table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductActivity from "./components/product.activity";

const ProductInformation = ({}) => {
  return (
    <div className="">
      <div className="flex justify-between">
        <GoBack />

        <div className="flex gap-x-[10px]">
          <button className="border rounded-lg border-border-gray shrink-0 font-medium flex gap-x-2 py-2 px-[22.3px]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5003 18.9587H7.50033C2.97533 18.9587 1.04199 17.0253 1.04199 12.5003V7.50033C1.04199 2.97533 2.97533 1.04199 7.50033 1.04199H9.16699C9.50866 1.04199 9.79199 1.32533 9.79199 1.66699C9.79199 2.00866 9.50866 2.29199 9.16699 2.29199H7.50033C3.65866 2.29199 2.29199 3.65866 2.29199 7.50033V12.5003C2.29199 16.342 3.65866 17.7087 7.50033 17.7087H12.5003C16.342 17.7087 17.7087 16.342 17.7087 12.5003V10.8337C17.7087 10.492 17.992 10.2087 18.3337 10.2087C18.6753 10.2087 18.9587 10.492 18.9587 10.8337V12.5003C18.9587 17.0253 17.0253 18.9587 12.5003 18.9587Z"
                fill="#1D1C1D"
              />
              <path
                d="M7.08311 14.7415C6.57478 14.7415 6.10811 14.5581 5.76645 14.2248C5.35811 13.8165 5.18311 13.2248 5.27478 12.5998L5.63311 10.0915C5.69978 9.60814 6.01645 8.98314 6.35811 8.64147L12.9248 2.0748C14.5831 0.416471 16.2664 0.416471 17.9248 2.0748C18.8331 2.98314 19.2414 3.90814 19.1581 4.83314C19.0831 5.58314 18.6831 6.31647 17.9248 7.06647L11.3581 13.6331C11.0164 13.9748 10.3914 14.2915 9.90811 14.3581L7.39978 14.7165C7.29145 14.7415 7.18311 14.7415 7.08311 14.7415ZM13.8081 2.95814L7.24145 9.5248C7.08311 9.68314 6.89978 10.0498 6.86645 10.2665L6.50811 12.7748C6.47478 13.0165 6.52478 13.2165 6.64978 13.3415C6.77478 13.4665 6.97478 13.5165 7.21645 13.4831L9.72478 13.1248C9.94145 13.0915 10.3164 12.9081 10.4664 12.7498L17.0331 6.18314C17.5748 5.64147 17.8581 5.15814 17.8998 4.70814C17.9498 4.16647 17.6664 3.59147 17.0331 2.9498C15.6998 1.61647 14.7831 1.99147 13.8081 2.95814Z"
                fill="#1D1C1D"
              />
              <path
                d="M16.5413 8.19124C16.483 8.19124 16.4246 8.18291 16.3746 8.16624C14.183 7.54957 12.4413 5.80791 11.8246 3.61624C11.733 3.28291 11.9246 2.94124 12.258 2.84124C12.5913 2.74957 12.933 2.94124 13.0246 3.27457C13.5246 5.04957 14.933 6.45791 16.708 6.95791C17.0413 7.04957 17.233 7.39957 17.1413 7.73291C17.0663 8.01624 16.8163 8.19124 16.5413 8.19124Z"
                fill="#1D1C1D"
              />
            </svg>
            Export CSV
          </button>

          <button className="border-border-gray bg-gray-4 rounded-lg p-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5001 5.60839C17.4834 5.60839 17.4584 5.60839 17.4334 5.60839C13.0251 5.16673 8.62505 5.00006 4.26672 5.44173L2.56672 5.60839C2.21672 5.64173 1.90839 5.39173 1.87505 5.04173C1.84172 4.69173 2.09172 4.39173 2.43339 4.35839L4.13339 4.19173C8.56672 3.74173 13.0584 3.91673 17.5584 4.35839C17.9001 4.39173 18.1501 4.70006 18.1167 5.04173C18.0917 5.36673 17.8167 5.60839 17.5001 5.60839Z"
                fill="#CF0C0C"
              />
              <path
                d="M7.08363 4.76699C7.05029 4.76699 7.01696 4.76699 6.97529 4.75866C6.64196 4.70033 6.40863 4.37533 6.46696 4.04199L6.65029 2.95033C6.78363 2.15033 6.96696 1.04199 8.90863 1.04199H11.092C13.042 1.04199 13.2253 2.19199 13.3503 2.95866L13.5336 4.04199C13.592 4.38366 13.3586 4.70866 13.0253 4.75866C12.6836 4.81699 12.3586 4.58366 12.3086 4.25033L12.1253 3.16699C12.0086 2.44199 11.9836 2.30033 11.1003 2.30033H8.91696C8.03363 2.30033 8.01696 2.41699 7.89196 3.15866L7.70029 4.24199C7.65029 4.55033 7.38363 4.76699 7.08363 4.76699Z"
                fill="#CF0C0C"
              />
              <path
                d="M12.675 18.9586H7.325C4.41666 18.9586 4.3 17.3503 4.20833 16.0503L3.66666 7.65864C3.64166 7.31697 3.90833 7.01697 4.25 6.99197C4.6 6.97531 4.89166 7.23364 4.91666 7.57531L5.45833 15.967C5.55 17.2336 5.58333 17.7086 7.325 17.7086H12.675C14.425 17.7086 14.4583 17.2336 14.5417 15.967L15.0833 7.57531C15.1083 7.23364 15.4083 6.97531 15.75 6.99197C16.0917 7.01697 16.3583 7.30864 16.3333 7.65864L15.7917 16.0503C15.7 17.3503 15.5833 18.9586 12.675 18.9586Z"
                fill="#CF0C0C"
              />
              <path
                d="M11.3834 14.375H8.6084C8.26673 14.375 7.9834 14.0917 7.9834 13.75C7.9834 13.4083 8.26673 13.125 8.6084 13.125H11.3834C11.7251 13.125 12.0084 13.4083 12.0084 13.75C12.0084 14.0917 11.7251 14.375 11.3834 14.375Z"
                fill="#CF0C0C"
              />
              <path
                d="M12.0837 11.042H7.91699C7.57533 11.042 7.29199 10.7587 7.29199 10.417C7.29199 10.0753 7.57533 9.79199 7.91699 9.79199H12.0837C12.4253 9.79199 12.7087 10.0753 12.7087 10.417C12.7087 10.7587 12.4253 11.042 12.0837 11.042Z"
                fill="#CF0C0C"
              />
            </svg>
          </button>
        </div>
      </div>
      <CardWrapper className="p-0 mt-[10px] mb-6">
        <div className="flex justify-between items-center px-4  border-b-2 border-b-gray-100">
          <h2 className="text-[16px] font-medium py-4">Product Information</h2>
          <Status status="Published" />
        </div>
        <div className="grid grid-cols-2 px-4 gap-x-4">
          <div className="border-r border-gray-100">
            <div className="py-4 border-b-2 border-b-gray-4 ">
              <h1 className="font-medium text-lg">1.5kVa Inverter Battery</h1>
              <p className="text-[#475367]">SKU-1234-SL</p>
            </div>
            <div className="grid grid-cols-4 gap-4 py-4 border-b-2 border-gray-100">
              <InfoDetail title="Category" value="Inverter" />
              <InfoDetail title="In stock" value="50" />
              <InfoDetail title="MOQ" value="50" />
              <InfoDetail title="Brand" value="Luminous" />
              <InfoDetail title="Model" value="Inverter" />
              <InfoDetail title="Items Sold" value="4" />
              <InfoDetail title="Last Update" value="Jan 5,2025" />
            </div>
            <div className="py-4">
              <span className="text-xs text-gray-3">Description</span>
              <p className="text-sm/[24px] ">
                Luminous 1.5 kVA inverter and battery combo is specially
                designed to cater today&apos;s need keeping future aspiration in
                mind, The inverter set powers all home appliances except home
                air-conditioners and 1 HP water motor, rest everything will be
                running for 4-6 hours whenever there is power outage such as led
                lights, fans, television, refrigerator, washing machine, mixer
                and laptop. This is a solar ready inverter that could be
                connected too solar panels in future to run all home appliances.
              </p>
            </div>
          </div>
          <div className="py-4 space-y-6">
            <ProductCarousel urls={["/carousel-1.png", "/carousel-2.png"]} />
            <div className="flex justify-between">
              <p className="font-medium text-[16px]">Unit Price</p>
              <h4 className="text-2xl font-semibold">₦980,000</h4>
            </div>
          </div>
        </div>
      </CardWrapper>
      <Tabs defaultValue="orders" className="w-full space-y-5">
        <TabsList className="border-b border-b-gray-200 w-full rounded-none">
          <TabsTrigger className="p-4 cursor-pointer" value="orders">
            Order History
          </TabsTrigger>
          <TabsTrigger className="p-4 cursor-pointer" value="activity">
            Product Activity
          </TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <OrderHistor data={customerInvoices} />
        </TabsContent>
        <TabsContent value="activity">
          <ProductActivity />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductInformation;
