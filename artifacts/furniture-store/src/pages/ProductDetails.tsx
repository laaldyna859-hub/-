import { useParams, Link } from "wouter";
import { Layout } from "@/components/Layout";
import { useGetProduct } from "@workspace/api-client-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, ShoppingCart, Truck, ShieldCheck, Ruler, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function ProductDetails() {
  const { id } = useParams();
  const { data: product, isLoading } = useGetProduct(Number(id), { 
    query: { enabled: !!id } 
  });
  
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (product) {
      addItem({
        productId: product.id,
        productName: product.name,
        price: product.price,
        image: product.images?.[0],
      });
      toast({
        title: "تم الإضافة بنجاح",
        description: `تمت إضافة ${product.name} إلى السلة.`,
      });
    }
  };

  const handleWhatsApp = () => {
    if (product) {
      const message = `مرحباً، أستفسر عن المنتج: ${product.name} (الكود: ${product.id})`;
      window.open(`https://wa.me/201000000000?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h2 className="text-2xl font-bold mb-4">المنتج غير موجود</h2>
          <Link href="/products">
            <Button>العودة للمنتجات</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const images = product.images?.length ? product.images : ["/images/placeholder.png"];

  return (
    <Layout>
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary transition-colors">المنتجات</Link>
          <span>/</span>
          {product.categoryName && (
            <>
              <Link href={`/products?category=${product.categoryId}`} className="hover:text-primary transition-colors">
                {product.categoryName}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground font-medium">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted border">
              <img 
                src={images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {product.isOffer && product.discountPercent && (
              <div className="inline-block bg-destructive/10 text-destructive px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                خصم خاص {product.discountPercent}%
              </div>
            )}
            
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-8 pb-8 border-b">
              <span className="text-3xl font-bold text-primary">
                {product.price.toLocaleString("ar-EG")} ج.م
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through">
                  {product.originalPrice.toLocaleString("ar-EG")} ج.م
                </span>
              )}
            </div>

            {product.description && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-3">الوصف</h3>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 bg-muted/30 p-6 rounded-xl border">
              {product.sizes && (
                <div>
                  <div className="flex items-center gap-2 text-primary font-bold mb-2">
                    <Ruler className="h-5 w-5" /> المقاسات
                  </div>
                  <p className="text-foreground/80">{product.sizes}</p>
                </div>
              )}
              {product.materials && (
                <div>
                  <div className="flex items-center gap-2 text-primary font-bold mb-2">
                    <ShieldCheck className="h-5 w-5" /> الخامات
                  </div>
                  <p className="text-foreground/80">{product.materials}</p>
                </div>
              )}
              {product.executionDays && (
                <div>
                  <div className="flex items-center gap-2 text-primary font-bold mb-2">
                    <Truck className="h-5 w-5" /> مدة التنفيذ
                  </div>
                  <p className="text-foreground/80">{product.executionDays} يوم عمل</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1 h-14 text-lg gap-2" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5" /> أضف للسلة
              </Button>
              <Button size="lg" variant="outline" className="flex-1 h-14 text-lg gap-2 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700" onClick={handleWhatsApp}>
                <MessageCircle className="h-5 w-5" /> استفسار عبر واتساب
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}