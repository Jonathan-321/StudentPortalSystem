import { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, CreditCard, Download, FileText, Loader2, PiggyBank, Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import PaymentMethods from "@/components/PaymentMethods";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";

export default function Finance() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Query financial data
  const { data: finances, isLoading: isLoadingFinances } = useQuery({
    queryKey: ["/api/finances"],
    enabled: !!user,
  });

  // Format currency amounts
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter transactions by search term
  const filteredTransactions = finances?.filter((finance: any) => 
    finance.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    finance.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    finance.status.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Calculate account balance
  const calculateBalance = () => {
    if (!finances) return 0;
    return finances.reduce((total: number, finance: any) => {
      if (finance.type === "credit") {
        return total + finance.amount;
      } else {
        return total - finance.amount;
      }
    }, 0);
  };

  // Calculate upcoming payments
  const upcomingPayments = finances?.filter((finance: any) => 
    finance.type === "debit" && finance.status === "pending" && new Date(finance.dueDate) > new Date()
  ) || [];

  // Recent transactions
  const recentTransactions = finances?.slice(0, 5) || [];

  return (
    <Layout title={t("Finance")}>
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>{t("Financial Overview")}</CardTitle>
            <CardDescription>{t("Current semester tuition and fees")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border rounded-lg p-4">
                <p className="text-sm text-gray-500">{t("Account Balance")}</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(calculateBalance())}</p>
                {calculateBalance() < 0 && (
                  <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                    {t("Your account has an outstanding balance")}
                  </div>
                )}
              </div>
              <div className="bg-white border rounded-lg p-4">
                <p className="text-sm text-gray-500">{t("Next Payment Due")}</p>
                {upcomingPayments.length > 0 ? (
                  <>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(upcomingPayments[0].amount)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {t("Due by")}: {format(new Date(upcomingPayments[0].dueDate), "PPP")}
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-medium mt-2 text-green-600">{t("No upcoming payments")}</p>
                )}
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">{t("Payment Summary")}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>{t("Tuition Fee")}</span>
                  <span className="font-medium">RWF 1,250,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t("Library Fee")}</span>
                  <span className="font-medium">RWF 25,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t("Technology Fee")}</span>
                  <span className="font-medium">RWF 50,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t("Student Union Fee")}</span>
                  <span className="font-medium">RWF 15,000</span>
                </div>
                <div className="flex justify-between items-center border-t border-dashed pt-2 font-bold">
                  <span>{t("Total")}</span>
                  <span>RWF 1,340,000</span>
                </div>
                <div className="flex justify-between items-center text-green-600">
                  <span>{t("Paid")}</span>
                  <span>RWF 800,000</span>
                </div>
                <div className="flex justify-between items-center text-red-600 font-bold">
                  <span>{t("Remaining")}</span>
                  <span>RWF 540,000</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/resources?document=fee-structure" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                {t("Fee Structure")}
              </Link>
            </Button>
            <Button onClick={() => {
              setPaymentAmount(540000);
              setShowPayment(true);
            }}>
              <CreditCard className="h-4 w-4 mr-2" />
              {t("Make Payment")}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("Payment Options")}</CardTitle>
            <CardDescription>{t("Ways to pay your tuition fees")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center">
                <div className="bg-primary-50 p-2 rounded-full mr-3">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{t("Online Payment")}</p>
                  <p className="text-xs text-gray-500">{t("Pay using cards or mobile money")}</p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center">
                <div className="bg-primary-50 p-2 rounded-full mr-3">
                  <PiggyBank className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{t("Bank Transfer")}</p>
                  <p className="text-xs text-gray-500">{t("Pay through your bank")}</p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center">
                <div className="bg-blue-50 p-2 rounded-full mr-3">
                  <Download className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{t("Download Invoice")}</p>
                  <p className="text-xs text-gray-500">{t("Get your payment invoice")}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">{t("Payment Installments")}</h4>
              <div className="space-y-2">
                <div className="text-xs flex justify-between">
                  <span>{t("First Installment")}</span>
                  <span className="font-medium">RWF 800,000 ({t("Paid")})</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <div className="text-xs flex justify-between">
                  <span>{t("Second Installment")}</span>
                  <span className="font-medium text-red-600">RWF 540,000 ({t("Due")})</span>
                </div>
                <Button onClick={() => {
                  setPaymentAmount(540000);
                  setShowPayment(true);
                }} className="w-full mt-2" size="sm">
                  {t("Pay Installment Now")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions and Payment History */}
      <div className="mb-6">
        <Tabs defaultValue="transactions">
          <div className="border-b border-gray-200">
            <TabsList className="flex -mb-px text-sm font-medium bg-transparent">
              <TabsTrigger value="transactions" className="inline-block p-4 border-b-2 rounded-t-lg focus:outline-none">
                {t("Transactions")}
              </TabsTrigger>
              <TabsTrigger value="scholarship" className="inline-block p-4 border-b-2 rounded-t-lg focus:outline-none">
                {t("Scholarships & Financial Aid")}
              </TabsTrigger>
              <TabsTrigger value="reports" className="inline-block p-4 border-b-2 rounded-t-lg focus:outline-none">
                {t("Reports")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="transactions" className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{t("Transaction History")}</h3>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder={t("Search transactions...")}
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {isLoadingFinances ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t("Description")}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t("Date")}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t("Amount")}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t("Status")}
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t("Actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map((finance: any) => (
                        <tr key={finance.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{finance.description}</div>
                            <div className="text-xs text-gray-500">{finance.reference}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(finance.date), "PPP")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${finance.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                              {finance.type === "credit" ? "+" : "-"}{formatCurrency(finance.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${finance.status === "completed" ? "bg-green-100 text-green-800" : 
                                finance.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                                finance.status === "failed" ? "bg-red-100 text-red-800" : 
                                "bg-gray-100 text-gray-800"}`
                            }>
                              {finance.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-primary-600 hover:text-primary-900 mr-3">
                              {t("View")}
                            </button>
                            {finance.status === "completed" && (
                              <button className="text-gray-600 hover:text-gray-900">
                                {t("Receipt")}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-white border rounded-lg">
                <p className="text-gray-500">{t("No transactions found")}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="scholarship" className="pt-4">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">{t("Available Scholarships")}</h3>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <h4 className="font-medium">UR Academic Excellence Scholarship</h4>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Open</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {t("Awarded to top-performing students based on academic merit. Covers up to 50% of tuition fees.")}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{t("Deadline")}: 15 Oct 2023</span>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      {t("View Details")}
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <h4 className="font-medium">National Research Grant</h4>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Open</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {t("For students conducting research in priority areas for Rwanda's development. Includes stipend and research budget.")}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{t("Deadline")}: 30 Nov 2023</span>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      {t("View Details")}
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Rwanda Development Board Scholarship</h4>
                    <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">Closed</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {t("Full scholarship for exceptional students in ICT, Engineering, and Business programs.")}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{t("Deadline")}: 1 Aug 2023</span>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      {t("View Details")}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">{t("Your Financial Aid")}</h3>
                <div className="border-t border-b py-4">
                  <p className="text-center text-gray-500">
                    {t("You don't have any active financial aid or scholarships")}
                  </p>
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" className="flex items-center w-full justify-center">
                    <Plus className="h-4 w-4 mr-2" />
                    {t("Apply for Financial Aid")}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="pt-4">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">{t("Financial Reports")}</h3>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4 hover:bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-2 rounded-full mr-3">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{t("Tuition Statement - 2023")}</p>
                      <p className="text-xs text-gray-500">{t("Complete breakdown of tuition and fees")}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Download className="h-4 w-4 mr-1" />
                    {t("Download")}
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-2 rounded-full mr-3">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{t("Payment Receipt - Semester 1")}</p>
                      <p className="text-xs text-gray-500">{t("Receipt for first installment payment")}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Download className="h-4 w-4 mr-1" />
                    {t("Download")}
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-2 rounded-full mr-3">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{t("Tax Certificate - 2022")}</p>
                      <p className="text-xs text-gray-500">{t("For tax deduction purposes")}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Download className="h-4 w-4 mr-1" />
                    {t("Download")}
                  </Button>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-md font-medium mb-3">{t("Request Custom Report")}</h4>
                <div className="flex space-x-4">
                  <Input placeholder={t("Report description...")} className="flex-grow" />
                  <Button>
                    {t("Request")}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {t("Custom reports will be processed within 2-3 business days")}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Payment Help Section */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-primary-900">{t("Need help with payment?")}</h3>
            <p className="text-primary-700 mt-2">
              {t("Contact the finance office or check our payment FAQs for assistance")}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button variant="outline" className="bg-white">
              {t("Payment FAQs")}
            </Button>
            <Button>
              {t("Contact Finance Office")}
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("Make a Payment")}</DialogTitle>
            <DialogDescription>
              {t("Choose your preferred payment method")}
            </DialogDescription>
          </DialogHeader>
          
          <PaymentMethods 
            amount={paymentAmount}
            onPaymentComplete={() => setShowPayment(false)}
            onCancel={() => setShowPayment(false)}
            description={t("Tuition Payment - Semester 1")}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
}