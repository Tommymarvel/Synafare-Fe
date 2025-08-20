import SearchInput from "@/components/search.input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

const MarketPlaceFilter = () => {
  return (
    <div className="shrink-0 space-y-5 w-[250px] border border-gray rounded-[6px] py-5 px-[10px]">
      <div className="flex justify-between">
        <span className="font-semibold">Filter</span>
        <button className="font-medium text-[#E2A109]">Reset</button>
      </div>
      <SearchInput
        className="rounded-md text-sm"
        placeholder="Search products"
      />

      <div>
        <Accordion
          type="multiple"
          defaultValue={["category", "price", "brand", "company"]}
        >
          <AccordionItem value="category">
            <AccordionTrigger className="hover:no-underline text-[16px] font-semibold">
              Category
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  className="border-gray-300 data-[state=checked]:bg-mikado-yellow data-[state=checked]:text-white data-[state=checked]:border-mikado-yellow "
                  id="inverter"
                />
                <p>Inverter</p>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  className="border-gray-300 data-[state=checked]:bg-mikado-yellow data-[state=checked]:text-white data-[state=checked]:border-mikado-yellow "
                  id="battery"
                />
                <p>Battery</p>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  className="border-gray-300 data-[state=checked]:bg-mikado-yellow data-[state=checked]:text-white data-[state=checked]:border-mikado-yellow "
                  id="battery"
                />
                <p>Panel</p>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  className="border-gray-300 data-[state=checked]:bg-mikado-yellow data-[state=checked]:text-white data-[state=checked]:border-mikado-yellow "
                  id="battery"
                />
                <p>Accessory</p>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="price" className="w-full">
            <AccordionTrigger className="hover:no-underline text-[16px] font-semibold">
              Price
            </AccordionTrigger>
            <AccordionContent className="space-y-3 w-full ">
              <div className="flex gap-x-1 w-full ">
                <input
                  type="text"
                  name="min"
                  className="border border-[#D0D5DD] rounded-[6px] w-1/2 py-[6px] placeholder:text-gray-2 ps-3"
                  placeholder="min"
                />
                <input
                  type="text"
                  name="max"
                  className="border border-[#D0D5DD] rounded-[6px] w-1/2 py-[6px] placeholder:text-gray-2 ps-3"
                  placeholder="max"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="brand">
            <AccordionTrigger className="hover:no-underline text-[16px] font-semibold">
              Brand
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  className="border-gray-300 data-[state=checked]:bg-mikado-yellow data-[state=checked]:text-white data-[state=checked]:border-mikado-yellow "
                  id="bluegate"
                />
                <p>Bluegate</p>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  className="border-gray-300 data-[state=checked]:bg-mikado-yellow data-[state=checked]:text-white data-[state=checked]:border-mikado-yellow "
                  id="Luminous"
                />
                <p>Luminous</p>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  className="border-gray-300 data-[state=checked]:bg-mikado-yellow data-[state=checked]:text-white data-[state=checked]:border-mikado-yellow "
                  id="pag"
                />
                <p>Prag (12)</p>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  className="border-gray-300 data-[state=checked]:bg-mikado-yellow data-[state=checked]:text-white data-[state=checked]:border-mikado-yellow "
                  id="logn"
                />
                <p>LONGi (12)</p>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  className="border-gray-300 data-[state=checked]:bg-mikado-yellow data-[state=checked]:text-white data-[state=checked]:border-mikado-yellow "
                  id="sunpower"
                />
                <p>SunPower (0)</p>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  className="border-gray-300 data-[state=checked]:bg-mikado-yellow data-[state=checked]:text-white data-[state=checked]:border-mikado-yellow "
                  id="huwaei"
                />
                <p>Huwaei (12)</p>
              </div>
              <button className="font-medium flex gap-x-1">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 10.625H5C4.65833 10.625 4.375 10.3417 4.375 10C4.375 9.65833 4.65833 9.375 5 9.375H15C15.3417 9.375 15.625 9.65833 15.625 10C15.625 10.3417 15.3417 10.625 15 10.625Z"
                    fill="#1D1C1D"
                  />
                  <path
                    d="M10 15.625C9.65833 15.625 9.375 15.3417 9.375 15V5C9.375 4.65833 9.65833 4.375 10 4.375C10.3417 4.375 10.625 4.65833 10.625 5V15C10.625 15.3417 10.3417 15.625 10 15.625Z"
                    fill="#1D1C1D"
                  />
                </svg>
                View more
              </button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="company">
            <AccordionTrigger className="hover:no-underline text-[16px] font-semibold">
              Company
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  className="border-gray-300 data-[state=checked]:bg-mikado-yellow data-[state=checked]:text-white data-[state=checked]:border-mikado-yellow "
                  id="bluegate"
                />
                <p>Rubitec Nigeria Ltd (18)</p>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  className="border-gray-300 data-[state=checked]:bg-mikado-yellow data-[state=checked]:text-white data-[state=checked]:border-mikado-yellow "
                  id="Luminous"
                />
                <p>Cloud Energy (12)</p>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  className="border-gray-300 data-[state=checked]:bg-mikado-yellow data-[state=checked]:text-white data-[state=checked]:border-mikado-yellow "
                  id="pag"
                />
                <p>Blue Camel Energy (12)</p>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  className="border-gray-300 data-[state=checked]:bg-mikado-yellow data-[state=checked]:text-white data-[state=checked]:border-mikado-yellow "
                  id="logn"
                />
                <p>Astrum Energy Soluti... (65)</p>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  className="border-gray-300 data-[state=checked]:bg-mikado-yellow data-[state=checked]:text-white data-[state=checked]:border-mikado-yellow "
                  id="sunpower"
                />
                <p>Solar Depot Nigeria (10)</p>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  className="border-gray-300 data-[state=checked]:bg-mikado-yellow data-[state=checked]:text-white data-[state=checked]:border-mikado-yellow "
                  id="huwaei"
                />
                <p>SolarKobo Store (12)</p>
              </div>
              <button className="font-medium flex gap-x-1">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 10.625H5C4.65833 10.625 4.375 10.3417 4.375 10C4.375 9.65833 4.65833 9.375 5 9.375H15C15.3417 9.375 15.625 9.65833 15.625 10C15.625 10.3417 15.3417 10.625 15 10.625Z"
                    fill="#1D1C1D"
                  />
                  <path
                    d="M10 15.625C9.65833 15.625 9.375 15.3417 9.375 15V5C9.375 4.65833 9.65833 4.375 10 4.375C10.3417 4.375 10.625 4.65833 10.625 5V15C10.625 15.3417 10.3417 15.625 10 15.625Z"
                    fill="#1D1C1D"
                  />
                </svg>
                View more
              </button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="location">
            <AccordionTrigger className="hover:no-underline text-[16px] font-semibold">
              Location
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <input
                type="text"
                name="max"
                className="border border-[#D0D5DD] rounded-[6px] w-full py-3 px-[14px] placeholder:text-gray-2 ps-3"
                placeholder="Input Location"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default MarketPlaceFilter;
