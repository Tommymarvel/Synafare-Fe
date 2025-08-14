import EmptyList from "@/app/(dashboard)/loan-requests/components/empty-list";

const UserLoanRequests = ({ data }: { data: any[] }) => {
  if (!data || data.length < 1) {
    return (
      <EmptyList
        title="No Loan Request"
        message="You do not have any loan request"
        src="/empty-loan.svg"
      />
    );
  }
  return "Show table";
};

export default UserLoanRequests;
