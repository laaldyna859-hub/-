import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubmitContact } from "@workspace/api-client-react";

export default function Contact() {
  const { toast } = useToast();
  const submitContact = useSubmitContact();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.message) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى تعبئة الحقول المطلوبة.",
      });
      return;
    }

    submitContact.mutate({
      data: formData
    }, {
      onSuccess: () => {
        toast({
          title: "تم الإرسال بنجاح",
          description: "شكراً لتواصلك معنا، سنقوم بالرد عليك في أقرب وقت.",
        });
        setFormData({ name: "", phone: "", email: "", message: "" });
      }
    });
  };

  return (
    <Layout>
      <div className="bg-primary/5 py-16 border-b border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">تواصل معنا</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نحن هنا للإجابة على استفساراتكم ومساعدتكم في اختيار الأثاث المناسب لمنزلكم.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info */}
          <div className="lg:col-span-1 space-y-8">
            <h2 className="text-2xl font-bold mb-8">معلومات التواصل</h2>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-full flex items-center justify-center shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">العنوان</h3>
                <p className="text-muted-foreground">شارع التسعين الشمالي، التجمع الخامس، القاهرة، مصر</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-full flex items-center justify-center shrink-0">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">الهاتف</h3>
                <p className="text-muted-foreground" dir="ltr">+20 123 456 7890</p>
                <p className="text-muted-foreground" dir="ltr">+20 109 876 5432</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-full flex items-center justify-center shrink-0">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">البريد الإلكتروني</h3>
                <p className="text-muted-foreground">info@luxuryfurniture.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-full flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">ساعات العمل</h3>
                <p className="text-muted-foreground">يومياً من ١٠ صباحاً إلى ١٠ مساءً</p>
                <p className="text-muted-foreground">الجمعة: من ٢ ظهراً إلى ١١ مساءً</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border-border shadow-md">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-2xl font-bold mb-8">أرسل لنا رسالة</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم بالكامل *</Label>
                      <Input 
                        id="name" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="h-12 bg-muted/50"
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
                        className="h-12 text-right bg-muted/50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
                    <Input 
                      id="email" 
                      type="email"
                      dir="ltr"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="h-12 text-right bg-muted/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">رسالتك *</Label>
                    <Textarea 
                      id="message" 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="min-h-[150px] bg-muted/50"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full md:w-auto h-14 px-12 text-lg"
                    disabled={submitContact.isPending}
                  >
                    {submitContact.isPending ? "جاري الإرسال..." : "إرسال الرسالة"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-20 w-full h-[400px] bg-muted rounded-2xl flex items-center justify-center border shadow-sm">
          <div className="text-center text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>خريطة جوجل التفاعلية (سيتم إضافتها لاحقاً)</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}