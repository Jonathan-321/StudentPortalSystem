import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Check, CreditCard, Smartphone, AlertTriangle } from "lucide-react";

export interface PaymentMethodsProps {
  amount: number;
  onPaymentComplete: () => void;
  onCancel: () => void;
  description?: string;
  currency?: string;
}

export default function PaymentMethods({ 
  amount, 
  onPaymentComplete, 
  onCancel, 
  description = "Tuition Payment", 
  currency = "RWF" 
}: PaymentMethodsProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleMomoPayment = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      toast({
        title: t("Invalid Phone Number"),
        description: t("Please enter a valid phone number"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call to MTN MoMo or Airtel Money
    setTimeout(() => {
      toast({
        title: t("Payment Request Sent"),
        description: t("Please check your phone to approve the payment"),
        action: (
          <div className="h-8 w-8 bg-primary-50 rounded-full flex items-center justify-center">
            <Smartphone className="h-4 w-4 text-primary" />
          </div>
        ),
      });
      setLoading(false);
      
      // Simulate successful payment after delay
      setTimeout(() => {
        toast({
          title: t("Payment Successful"),
          description: t("Your payment of {{amount}} has been processed", { amount: formatAmount(amount) }),
          action: (
            <div className="h-8 w-8 bg-green-50 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-green-600" />
            </div>
          ),
        });
        onPaymentComplete();
      }, 3000);
    }, 2000);
  };

  const handleCardPayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
      toast({
        title: t("Incomplete Card Details"),
        description: t("Please fill in all the required card information"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate card payment processing
    setTimeout(() => {
      setLoading(false);
      toast({
        title: t("Payment Successful"),
        description: t("Your payment of {{amount}} has been processed", { amount: formatAmount(amount) }),
        action: (
          <div className="h-8 w-8 bg-green-50 rounded-full flex items-center justify-center">
            <Check className="h-4 w-4 text-green-600" />
          </div>
        ),
      });
      onPaymentComplete();
    }, 3000);
  };

  const handleBankTransfer = async () => {
    if (!selectedBank) {
      toast({
        title: t("Bank Not Selected"),
        description: t("Please select your bank to continue"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate bank transfer processing
    setTimeout(() => {
      setLoading(false);
      toast({
        title: t("Bank Transfer Initiated"),
        description: t("You will be redirected to your bank's website to complete the payment"),
      });
      
      // Simulate successful redirection
      window.setTimeout(() => {
        // In a real implementation, this would redirect to the bank's site
        toast({
          title: t("Payment Successful"),
          description: t("Your payment of {{amount}} has been processed", { amount: formatAmount(amount) }),
          action: (
            <div className="h-8 w-8 bg-green-50 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-green-600" />
            </div>
          ),
        });
        onPaymentComplete();
      }, 4000);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t("Payment Methods")}</CardTitle>
        <CardDescription>
          {description} - {formatAmount(amount)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="momo">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="momo">{t("Mobile Money")}</TabsTrigger>
            <TabsTrigger value="card">{t("Card")}</TabsTrigger>
            <TabsTrigger value="bank">{t("Bank Transfer")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="momo" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>{t("Choose Provider")}</Label>
              <RadioGroup defaultValue="mtn" className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mtn" id="mtn" />
                  <Label htmlFor="mtn" className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded mr-2 flex items-center justify-center text-white font-bold">MTN</div>
                    MTN Mobile Money
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="airtel" id="airtel" />
                  <Label htmlFor="airtel" className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded mr-2 flex items-center justify-center text-white font-bold">AM</div>
                    Airtel Money
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">{t("Mobile Money Number")}</Label>
              <Input 
                id="phone" 
                placeholder="07X XXX XXXX"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{t("Enter the number registered with Mobile Money")}</p>
            </div>
            
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200 flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
              <p className="text-xs text-amber-800">
                {t("You will receive a prompt on your phone to confirm this payment. Please ensure your phone is available and has sufficient balance.")}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="card" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">{t("Card Number")}</Label>
              <Input 
                id="card-number" 
                placeholder="XXXX XXXX XXXX XXXX"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">{t("Expiry Date")}</Label>
                <Input 
                  id="expiry" 
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">{t("CVV")}</Label>
                <Input 
                  id="cvv" 
                  placeholder="XXX"
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">{t("Name on Card")}</Label>
              <Input 
                id="name" 
                placeholder="John Doe"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
              />
            </div>
            
            <div className="flex items-center text-xs text-gray-500 mt-2">
              <CreditCard className="h-4 w-4 mr-2" />
              {t("Your card details are secure and encrypted")}
            </div>
          </TabsContent>
          
          <TabsContent value="bank" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank">{t("Select Your Bank")}</Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger id="bank">
                  <SelectValue placeholder={t("Choose a bank")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bnr">Bank of Kigali</SelectItem>
                  <SelectItem value="equity">Equity Bank Rwanda</SelectItem>
                  <SelectItem value="access">Access Bank Rwanda</SelectItem>
                  <SelectItem value="i&m">I&M Bank Rwanda</SelectItem>
                  <SelectItem value="GT">GT Bank Rwanda</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <p className="text-sm font-medium text-blue-700 mb-1">{t("How it works:")}</p>
              <ol className="text-xs text-blue-800 pl-5 list-decimal">
                <li>{t("Select your bank from the list")}</li>
                <li>{t("You'll be redirected to your bank's secure login page")}</li>
                <li>{t("Log in to your account and confirm the payment")}</li>
                <li>{t("After successful payment, you'll be returned to this page")}</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          {t("Cancel")}
        </Button>
        <Button 
          onClick={() => {
            const selectedTab = document.querySelector('[role="tablist"] [data-state="active"]')?.getAttribute('value');
            if (selectedTab === 'momo') handleMomoPayment();
            else if (selectedTab === 'card') handleCardPayment();
            else if (selectedTab === 'bank') handleBankTransfer();
          }}
          disabled={loading}
        >
          {loading ? t("Processing...") : t("Pay Now")}
        </Button>
      </CardFooter>
    </Card>
  );
}