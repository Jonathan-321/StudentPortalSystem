import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";

export default function Finance() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const { data: finances, isLoading } = useQuery({
    queryKey: ["/api/finances"],
    enabled: !!user,
  });

  if (!user) return null;

  // Calculate total balance
  const calculateBalance = () => {
    if (!finances) return 0;
    
    return finances.reduce((acc, finance) => {
      if (finance.type === 'payment') {
        return acc - finance.amount;
      } else if (finance.type === 'fee') {
        return acc + finance.amount;
      } else {
        // For scholarships, reduce the balance
        return acc - finance.amount;
      }
    }, 0);
  };

  const balance = calculateBalance();

  // Prepare data for chart
  const getChartData = () => {
    if (!finances) return [];
    
    const months: {[key: string]: {fees: number, payments: number, scholarships: number}} = {};
    
    finances.forEach(finance => {
      const date = new Date(finance.transactionDate);
      const monthYear = format(date, 'MMM yyyy');
      
      if (!months[monthYear]) {
        months[monthYear] = { fees: 0, payments: 0, scholarships: 0 };
      }
      
      if (finance.type === 'fee') {
        months[monthYear].fees += finance.amount;
      } else if (finance.type === 'payment') {
        months[monthYear].payments += finance.amount;
      } else if (finance.type === 'scholarship') {
        months[monthYear].scholarships += finance.amount;
      }
    });
    
    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data
    }));
  };

  const chartData = getChartData();

  return (
    <Layout title="Finance">
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={`${balance > 0 ? 'border-red-200' : 'border-green-200'}`}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-sm text-gray-500 uppercase mb-1">{t('Current Balance')}</h3>
                <p className={`text-2xl font-bold ${balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {balance > 0 ? `RWF ${balance.toLocaleString()}` : `RWF 0`}
                </p>
                <p className="text-sm mt-1">
                  {balance > 0 
                    ? t('Outstanding balance')
                    : t('Fully paid')}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-sm text-gray-500 uppercase mb-1">{t('Last Payment')}</h3>
                <p className="text-2xl font-bold text-primary-500">
                  {finances && finances.filter(f => f.type === 'payment').length > 0
                    ? `RWF ${finances.filter(f => f.type === 'payment').sort((a, b) => 
                        new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
                      )[0].amount.toLocaleString()}`
                    : 'RWF 0'}
                </p>
                <p className="text-sm mt-1">
                  {finances && finances.filter(f => f.type === 'payment').length > 0
                    ? format(new Date(finances.filter(f => f.type === 'payment').sort((a, b) => 
                        new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
                      )[0].transactionDate), 'MMM d, yyyy')
                    : '-'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-sm text-gray-500 uppercase mb-1">{t('Next Payment Due')}</h3>
                <p className="text-2xl font-bold text-primary-500">
                  {balance > 0 ? `RWF ${Math.min(balance, 100000).toLocaleString()}` : 'RWF 0'}
                </p>
                <p className="text-sm mt-1">
                  {balance > 0 ? 'November 15, 2023' : t('No payment due')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="transactions">{t('Transactions')}</TabsTrigger>
            <TabsTrigger value="invoices">{t('Invoices & Receipts')}</TabsTrigger>
            <TabsTrigger value="payment">{t('Make Payment')}</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>{t('Transaction History')}</CardTitle>
                <CardDescription>
                  {t('Record of all financial transactions')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : finances?.length === 0 ? (
                  <Alert className="bg-blue-50 text-blue-700 border-blue-200">
                    <AlertTitle>{t('No Transactions')}</AlertTitle>
                    <AlertDescription>
                      {t('You have no transaction records at this time')}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="fees" name={t('Fees')} stackId="a" fill="#FF8042" />
                          <Bar dataKey="payments" name={t('Payments')} stackId="a" fill="#00C49F" />
                          <Bar dataKey="scholarships" name={t('Scholarships')} stackId="a" fill="#0088FE" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Date')}</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Description')}</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Type')}</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Amount')}</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Status')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {finances?.map((finance) => (
                            <tr key={finance.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {format(new Date(finance.transactionDate), 'MMM d, yyyy')}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                {finance.description || 
                                  (finance.type === 'fee' ? 'Tuition Fee' : 
                                   finance.type === 'payment' ? 'Tuition Payment' : 
                                   'Scholarship Award')}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  finance.type === 'fee' ? 'bg-orange-100 text-orange-800' :
                                  finance.type === 'payment' ? 'bg-green-100 text-green-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {finance.type.charAt(0).toUpperCase() + finance.type.slice(1)}
                                </span>
                              </td>
                              <td className={`px-4 py-3 text-sm font-medium ${
                                finance.type === 'fee' ? 'text-red-500' : 'text-green-500'
                              }`}>
                                {finance.type === 'fee' ? '+' : '-'} RWF {finance.amount.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  finance.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  finance.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {finance.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>{t('Invoices & Receipts')}</CardTitle>
                <CardDescription>
                  {t('Download or view your financial documents')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{t('Tuition Invoice')} - {t('Semester')} 1, 2023</h3>
                        <p className="text-sm text-gray-500 mt-1">{t('Issue Date')}: October 1, 2023</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <i className="fas fa-eye mr-2"></i>
                          {t('View')}
                        </Button>
                        <Button variant="outline" size="sm">
                          <i className="fas fa-download mr-2"></i>
                          {t('Download')}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{t('Payment Receipt')} - RWF 250,000</h3>
                        <p className="text-sm text-gray-500 mt-1">{t('Payment Date')}: October 5, 2023</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <i className="fas fa-eye mr-2"></i>
                          {t('View')}
                        </Button>
                        <Button variant="outline" size="sm">
                          <i className="fas fa-download mr-2"></i>
                          {t('Download')}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{t('Tuition Invoice')} - {t('Semester')} 2, 2022</h3>
                        <p className="text-sm text-gray-500 mt-1">{t('Issue Date')}: March 1, 2023</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <i className="fas fa-eye mr-2"></i>
                          {t('View')}
                        </Button>
                        <Button variant="outline" size="sm">
                          <i className="fas fa-download mr-2"></i>
                          {t('Download')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>{t('Make a Payment')}</CardTitle>
                <CardDescription>
                  {t('Choose your preferred payment method')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">{t('Payment Summary')}</h3>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">{t('Tuition Fee')}</span>
                      <span>RWF 500,000</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">{t('Registration Fee')}</span>
                      <span>RWF 20,000</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">{t('Technology Fee')}</span>
                      <span>RWF 30,000</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 text-red-500">
                      <span>{t('Scholarship')}</span>
                      <span>- RWF 100,000</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold">
                      <span>{t('Total Due')}</span>
                      <span>RWF 450,000</span>
                    </div>
                    <div className="flex justify-between py-2 text-green-500">
                      <span>{t('Paid to Date')}</span>
                      <span>RWF 250,000</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold">
                      <span>{t('Remaining Balance')}</span>
                      <span>RWF 200,000</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="cursor-pointer hover:border-primary-500 transition-colors">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="rounded-full bg-blue-100 p-4 mb-4">
                          <i className="fas fa-credit-card text-blue-500 text-2xl"></i>
                        </div>
                        <h3 className="font-medium">{t('Credit/Debit Card')}</h3>
                        <p className="text-sm text-gray-500 mt-1">{t('Pay securely with your card')}</p>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:border-primary-500 transition-colors">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="rounded-full bg-green-100 p-4 mb-4">
                          <i className="fas fa-mobile-alt text-green-500 text-2xl"></i>
                        </div>
                        <h3 className="font-medium">{t('Mobile Money')}</h3>
                        <p className="text-sm text-gray-500 mt-1">{t('MTN Mobile Money, Airtel Money')}</p>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:border-primary-500 transition-colors">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="rounded-full bg-yellow-100 p-4 mb-4">
                          <i className="fas fa-university text-yellow-500 text-2xl"></i>
                        </div>
                        <h3 className="font-medium">{t('Bank Transfer')}</h3>
                        <p className="text-sm text-gray-500 mt-1">{t('Direct bank transfer')}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    <i className="fas fa-info-circle mr-1"></i>
                    {t('For payment assistance, please contact the finance office')}
                  </p>
                </div>
                <Button>
                  {t('Proceed to Payment')}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
