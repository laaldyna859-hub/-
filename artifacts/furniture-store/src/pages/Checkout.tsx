import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateOrder } from "@workspace/api-client-react";

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createOrder = useCreateOrder();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    governorate: "",
    address: "",
    notes: ""
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleWhatsAppCheckout = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast({
        variant: "destructive",
        title: "بيانات ناقصة",
        description: "يرجى تعبئة جميع الحقول المطلوبة (الاسم، رقم الهاتف، العنوان).",
      });
      return;
    }

    const orderText = items.map(i => `- ${i.productName} (الكمية: ${i.quantity})`).join('\n');
    const message = `مرحباً، أود تأكيد طلبي:\n\nالمنتجات:\n${orderText}\n\nالإجمالي: ${getTotal().toLocaleString("ar-EG")} ج.م\n\nبيانات التواصل:\nالاسم: ${formData.name}\nرقم الهاتف: ${formData.phone}\nالمحافظة: ${formData.governorate}\nالعنوان: ${formData.address}\nملاحظات: ${formData.notes || "لا يوجد"}`;
    
    // Save order to backend
    createOrder.mutate({
      data: {
        customerName: formData.name,
        phone: formData.phone,
        governorate: formData.governorate,
        address: formData.address,
        notes: formData.notes,
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price
        }))
      }
    });

    window.open(`https://wa.me/201000000000?text=${encodeURIComponent(message)}`, '_blank');
    clearCart();
    setIsSuccess(true);
  };

  const handleSystemCheckout = () => {
     if (!formData.name || !formData.phone || !formData.address) {
      toast({
        variant: "destructive",
        title: "بيانات ناقصة",
        description: "يرجى تعبئة جميع الحقول المطلوبة.",
      });
      return;
    }

    createOrder.mutate({
      data: {
        customerName: formData.name,
        phone: formData.phone,
        governorate: formData.governorate,
        address: formData.address,
        notes: formData.notes,
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price
        }))
      }
    }, {
      onSuccess: () => {
        clearCart();
        setIsSuccess(true);
      }
    });
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center max-w-md">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">تم استلام طلبك بنجاح</h2>
          <p className="text-muted-foreground mb-8">سنتواصل معك قريباً لتأكيد الطلب وموعد التسليم.</p>
          <Link href="/">
            <Button size="lg" className="w-full">العودة للرئيسية</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  return (
    <Layout>
      <div className="bg-primary/5 py-8 border-b border-primary/10 mb-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl font-bold text-primary">إتمام الطلب</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Form */}
          <div className="flex-1">
            <Card className="border-primary/20 shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 pb-4 border-b">بيانات الشحن</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم بالكامل *</Label>
                      <Input 
                        id="name" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف *</Label>
                      <Input 
                        id="phone" 
                        type="tel"
                        dir="ltr"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="h-12 text-right"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="governorate">المحافظة *</Label>
                    <Input 
                      id="governorate" 
                      value={formData.governorate}
                      onChange={(e) => setFormData({...formData, governorate: e.target.value})}
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان بالتفصيل *</Label>
                    <Textarea 
                      id="address" 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                    <Textarea 
                      id="notes" 
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-96 shrink-0 space-y-6">
            <Card className="border-primary/20 shadow-sm bg-muted/20">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-6 pb-4 border-b">ملخص الطلب</h3>
                
                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-foreground/80 line-clamp-1 pl-4 flex-1">
                        {item.quantity}x {item.productName}
                      </span>
                      <span className="font-bold shrink-0">
                        {(item.price * item.quantity).toLocaleString("ar-EG")} ج.م
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-lg font-bold text-foreground pt-4 border-t mb-8">
                  <span>الإجمالي المطلوب</span>
                  <span className="text-primary text-xl">{getTotal().toLocaleString("ar-EG")} ج.م</span>
                </div>

                <div className="space-y-4">
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg bg-[#25D366] hover:bg-[#128C7E] text-white"
                    onClick={handleWhatsAppCheckout}
                  >
                    <MessageCircle className="ml-2 h-5 w-5" /> تأكيد عبر واتساب
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full h-14"
                    onClick={handleSystemCheckout}
                    disabled={createOrder.isPending}
                  >
                    تأكيد الطلب (دفع عند الاستلام)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}