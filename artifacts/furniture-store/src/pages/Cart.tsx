import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotal } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center max-w-md">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">السلة فارغة</h2>
          <p className="text-muted-foreground mb-8">لم تقم بإضافة أي منتجات إلى سلة التسوق حتى الآن.</p>
          <Link href="/products">
            <Button size="lg" className="w-full">تصفح المنتجات</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-primary/5 py-12 border-b border-primary/10">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-bold text-primary mb-4">سلة التسوق</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <Card key={item.productId} className="overflow-hidden">
                <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden shrink-0 border">
                    <img 
                      src={item.image || "/images/placeholder.png"} 
                      alt={item.productName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-right">
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="font-bold text-lg hover:text-primary transition-colors">{item.productName}</h3>
                    </Link>
                    <p className="text-primary font-bold mt-2">
                      {item.price.toLocaleString("ar-EG")} ج.م
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg bg-background">
                      <button 
                        className="p-2 hover:bg-muted transition-colors rounded-r-lg"
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button 
                        className="p-2 hover:bg-muted transition-colors rounded-l-lg"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="w-full lg:w-96 shrink-0">
            <Card className="sticky top-28 border-primary/20 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-6 pb-4 border-b">ملخص الطلب</h3>
                
                <div className="space-y-4 mb-6 text-foreground/80">
                  <div className="flex justify-between">
                    <span>عدد المنتجات</span>
                    <span className="font-bold">{items.reduce((acc, i) => acc + i.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-foreground pt-4 border-t">
                    <span>الإجمالي</span>
                    <span className="text-primary">{getTotal().toLocaleString("ar-EG")} ج.م</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/checkout">
                    <Button size="lg" className="w-full h-14 text-lg">
                      إتمام الطلب
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline" className="w-full h-14">
                      متابعة التسوق
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}