import EmptyList from "@/app/(dashboard)/loan-requests/components/empty-list";
import CardWrapper from "@/components/cardWrapper";
import SearchInput from "@/components/search.input";

const UserCustomer = ({ data }: { data: any[] }) => {
  if (!data || data.length < 1) {
    return (
      <CardWrapper className="px-[23px] py-3 rounded-lg">
        <div className="max-w-[334px] w-full">
          <SearchInput />
        </div>
        <EmptyList
          title="No Customer"
          message="User does not have any customer"
          src="/printing-invoice.svg"
        />
      </CardWrapper>
    );
  }
  return "Show table";
};

export default UserCustomer;
